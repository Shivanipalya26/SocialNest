import { Request, Response } from 'express';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';
import { X_API_KEY, X_API_KEY_SECRET } from '../config/config';
import prisma from '../config/prisma.config';
import { encryptToken } from '../utils/crypto';
import { AuthRequest } from '../types';

const oauth = new OAuth({
  consumer: {
    key: X_API_KEY,
    secret: X_API_KEY_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

export const requestToken = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  const callback = `https://server.shivanipalya.tech/api/x/callback?loggedUserId=${userId}`;

  const requestData = {
    url: 'https://api.x.com/oauth/request_token',
    method: 'POST',
    data: { oauth_callback: callback },
  };

  try {
    const headers = oauth.toHeader(oauth.authorize(requestData));

    const response = await axios.post(requestData.url, null, {
      headers: { Authorization: headers.Authorization },
    });

    const { oauth_token } = Object.fromEntries(new URLSearchParams(response.data));
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request token error:', error);
    }
    res.status(500).json({ error: 'Failed to get request token' });
  }
};

export const callback = async (req: Request, res: Response) => {
  const { oauth_token, oauth_verifier, loggedUserId } = req.query;
  console.log(
    'oauth_token:',
    oauth_token,
    ' oauth_verifier:',
    oauth_verifier,
    ' loggedUserId:',
    loggedUserId
  );

  if (!oauth_token || !oauth_verifier || !loggedUserId) {
    return res.redirect(
      `${process.env.CLIENT_URL}/error?message=Missing oauth_token or oauth_verifier`
    );
  }

  try {
    await axios.post(`${process.env.SERVER_URL}/api/x/access-token`, {
      oauth_token,
      oauth_verifier,
      loggedUserId,
    });

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Callback error:', error);
    }
    return res.redirect(
      `${process.env.CLIENT_URL}/error?message=Failed to complete authentication`
    );
  }
};

export const accessToken = async (req: Request, res: Response) => {
  const { oauth_token, oauth_verifier, loggedUserId } = req.body;
  console.log('Logged User:', loggedUserId);

  if (!oauth_token || !oauth_verifier || !loggedUserId) {
    res.status(400).json({ error: 'Missing oauth_token or oauth_verifier or loggedUserId' });
    return;
  }

  const requestData = {
    url: 'https://api.x.com/oauth/access_token',
    method: 'POST',
    data: {
      oauth_token,
      oauth_verifier,
    },
  };

  try {
    const headers = oauth.toHeader(oauth.authorize(requestData));

    const response = await axios.post(requestData.url, null, {
      headers: { Authorization: headers.Authorization },
    });

    const {
      oauth_token: accessToken,
      oauth_token_secret: accessTokenSecret,
      user_id,
      // screen_name
    } = Object.fromEntries(new URLSearchParams(response.data));

    if (!accessToken || !accessTokenSecret || !user_id) {
      res.status(500).json({ message: 'Failed to get access token' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: loggedUserId },
      include: { accounts: true },
    });

    if (!existingUser) {
      res.status(404).json({ msg: 'User not found' });
    }

    const existingUserXAccount = existingUser?.accounts.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (account: any) => account.provider === 'x'
    );

    let encryptedAccessToken: string | undefined;
    let encryptedAccessTokenSecret: string | undefined;
    let accessTokenIv: string | undefined;
    let accessTokenIvSecret: string | undefined;

    if (accessToken) {
      const { encrypted, iv } = encryptToken(accessToken);
      encryptedAccessToken = encrypted;
      accessTokenIv = iv;
    }

    if (accessTokenSecret) {
      const { encrypted, iv } = encryptToken(accessTokenSecret);
      encryptedAccessTokenSecret = encrypted;
      accessTokenIvSecret = iv;
    }

    if (existingUserXAccount) {
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: 'x',
            providerAccountId: existingUserXAccount.providerAccountId,
          },
        },
        data: {
          access_token: encryptedAccessToken,
          access_token_secret: encryptedAccessTokenSecret,
          access_token_iv: accessTokenIv,
          access_token_secret_iv: accessTokenIvSecret,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.account.create({
        data: {
          provider: 'x',
          providerAccountId: user_id,
          userId: loggedUserId,
          access_token: encryptedAccessToken,
          access_token_secret: encryptedAccessTokenSecret,
          access_token_iv: accessTokenIv,
          access_token_secret_iv: accessTokenIvSecret,
          scope: 'tweet.read tweet.write users.read offline.access',
          type: 'oauth:1.0a',
        },
      });
    }

    console.log('message: Authentication successful');
    res.status(200).json({ msg: 'Successful' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Access token error:', error);
    }
    res.status(500).json({ error: 'Failed to get access token' });
  }
};

export const getUserDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const loggedUserId = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!loggedUserId) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xAccount = loggedUserId.accounts.find((account: any) => account.provider === 'x');

    if (!xAccount) {
      res.status(400).json({ error: 'User not connected to x' });
      return;
    }

    const { access_token, access_token_secret } = xAccount;

    const requestData = {
      url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
      method: 'GET',
    };

    const headers = oauth.toHeader(
      oauth.authorize(
        {
          url: requestData.url,
          method: requestData.method,
        },
        {
          key: access_token!,
          secret: access_token_secret!,
        }
      )
    );

    const response = await axios.get(requestData.url, {
      headers: {
        Authorization: headers.Authorization,
      },
    });

    res.status(200).json(response.data);
    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to get Twitter user details:', error.response?.data || error.message);
    }
    res.status(500).json({ msg: 'Internal error: ', error });
  }
};
