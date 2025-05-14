import { Request, Response } from 'express';
import prisma from '../config/prisma.config';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { X_API_KEY, X_API_KEY_SECRET } from '../config/config';
import axios from 'axios';

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

export const postTweet = async (req: Request, res: Response): Promise<void> => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    res.status(404).json({ error: 'Missing userId or tweet text' });
  }

  try {
    const loggedUserId = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!loggedUserId) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const xAccount = loggedUserId.accounts.find(account => account.provider === 'x');

    if (!xAccount) {
      res.status(400).json({ error: 'User not connected to x' });
      return;
    }

    const { access_token, access_token_secret } = xAccount;
    console.log('Acess token:', access_token);
    console.log('Acess token secret:', access_token_secret);

    const url = 'https://api.twitter.com/2/tweets';
    const method = 'POST';

    const tweetPayload = {
      text: text || '',
    };

    const authHeader = oauth.toHeader(
      oauth.authorize(
        {
          url: url,
          method: method,
        },
        {
          key: access_token!,
          secret: access_token_secret!,
        }
      )
    );

    console.log('OAuth Header:', authHeader.Authorization);
    console.log('Consumer Key:', X_API_KEY);
    console.log('Consumer Secret:', X_API_KEY_SECRET);
    console.log('Access Token:', access_token);
    console.log('Access Token Secret:', access_token_secret);

    const response = await axios.post(url, tweetPayload, {
      headers: {
        Authorization: authHeader.Authorization,
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.43.0',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    });
    console.log('Requesting URL:', url);
    console.log('Posting data:', tweetPayload);

    console.log('Tweet posted:', response.data);

    res.status(200).json({ msg: 'Tweet posted successfully ', tweet: response.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const twitterError = err.response?.data;
    console.error('Twitter Error Details:');
    console.dir(twitterError, { depth: null });
    res.status(500).json({
      error: 'Failed to post tweet',
      details: err,
    });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
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

    const xAccount = loggedUserId.accounts.find(account => account.provider === 'x');

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

    console.log('Twitter user details fetched successfully');
    res.status(200).json(response.data);
    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to get Twitter user details:', error.response?.data || error.message);
    res.status(500).json({ msg: 'Internal error: ', error });
  }
};

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  const { userId, mediaUrl, statusText } = req.body;

  if (!userId || !mediaUrl) {
    res.status(400).json({ error: 'Missing userId or mediaUrl' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const account = user.accounts.find(a => a.provider === 'x');
    if (!account) {
      res.status(400).json({ error: 'User not connected to X' });
      return;
    }

    const { access_token, access_token_secret } = account;

    // Fetch the media as buffer
    const mediaResponse = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
    });
    const mediaData = Buffer.from(mediaResponse.data).toString('base64');

    const url = 'https://upload.twitter.com/1.1/media/upload.json';
    const method = 'POST';
    const data = { media: mediaData };

    const authHeader = oauth.toHeader(
      oauth.authorize(
        { url, method, data },
        {
          key: access_token!,
          secret: access_token_secret!,
        }
      )
    );

    const response = await axios.post(url, new URLSearchParams(data), {
      headers: {
        Authorization: authHeader.Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const mediaIdStr = response.data.media_id_string;
    console.log('Uploaded media:', response.data);

    const tweetUrl = 'https://api.twitter.com/2/tweets';
    const tweetMethod = 'POST';

    const tweetPayload = {
      text: statusText || '',
      media: {
        media_ids: [mediaIdStr],
      },
    };

    const tweetAuth = oauth.toHeader(
      oauth.authorize(
        { url: tweetUrl, method: tweetMethod },
        {
          key: access_token!,
          secret: access_token_secret!,
        }
      )
    );

    const tweetResponse = await axios.post(tweetUrl, tweetPayload, {
      headers: {
        Authorization: tweetAuth.Authorization,
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.43.0',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    });

    console.log('Tweet Response', tweetResponse.status);

    res.status(200).json({ media: tweetResponse.data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Media upload failed:', error.response?.data || error.message);
    res
      .status(500)
      .json({ error: 'Media upload failed', details: error.response?.data || error.message });
  }
};
