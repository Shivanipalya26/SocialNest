import { Request, Response } from 'express';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';
import { X_API_KEY, X_API_KEY_SECRET } from '../config/config';
import prisma from '../config/prisma.config';

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
  const callback = `http://localhost:5000/api/x/callback?loggedUserId=${userId}`;

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

    console.log('response: ', response);
    const { oauth_token } = Object.fromEntries(new URLSearchParams(response.data));
    res.json({ oauth_token });
  } catch (error) {
    console.error('Request token error: ', error);
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
    const response = await axios.post(`${process.env.SERVER_URL}/api/x/access-token`, {
      oauth_token,
      oauth_verifier,
      loggedUserId,
    });

    console.log('Response data: ', response);
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Callback error:', error);
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

    const existingUserXAccount = existingUser?.accounts.find(account => account.provider === 'x');

    if (existingUserXAccount) {
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: 'x',
            providerAccountId: existingUserXAccount.providerAccountId,
          },
        },
        data: {
          access_token: accessToken,
          access_token_secret: accessTokenSecret,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.account.create({
        data: {
          provider: 'x',
          providerAccountId: user_id,
          userId: loggedUserId,
          access_token: accessToken,
          access_token_secret: accessTokenSecret,
          scope: 'tweet.read tweet.write users.read offline.access',
          type: 'oauth:1.0a',
        },
      });
    }

    console.log('message: Authentication successful');
    res.status(200).json({ msg: 'Successful' });

    // res.status(200).json({
    //   message: "Authentication successful",
    //   access_token: tokenData.oauth_token,
    //   access_token_secret: tokenData.oauth_token_secret,
    //   user_id: tokenData.user_id,
    //   screen_name: tokenData.screen_name
    // });
  } catch (error) {
    console.error('Access token error:', error);
    res.status(500).json({ error: 'Failed to get access token' });
  }
};
