import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { LinkedinUtils } from '../utils/linkedinUtils/linkedinUtils';

const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

const SCOPE = 'openid profile email w_member_social';

export const redirect = (req: Request, res: Response) => {
  const state = crypto.randomUUID();

  res.cookie('linkedin_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 10,
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    LINKEDIN_REDIRECT_URI!
  )}&scope=${encodeURIComponent(SCOPE)}&state=${state}&prompt=consent`;
  console.log(authUrl);

  res.redirect(authUrl);
};

export const callback = async (req: Request, res: Response): Promise<void> => {
  console.log(req.query.code as string);
  const code = req.query.code as string;
  const state = req.query.state as string;
  const storedState = req.cookies.linkedin_oauth_state;

  if (!state || !storedState || state !== storedState) {
    res.status(403).json({ error: 'Invalid or missing state parameter' });
  }

  try {
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, id_token } = tokenResponse.data;

    console.log('access token, ', access_token);
    console.log('id_token', id_token);

    // Optional: Get LinkedIn user ID
    const decoded = jwt.decode(id_token) as {
      email?: string;
      name?: string;
      sub?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };

    console.log('decode, ', decoded);

    // res.json({
    //   message: 'Authorized via LinkedIn OpenID!',
    //   accessToken: access_token,
    //   idToken: id_token,
    //   userInfo: decoded,
    // });

    res.clearCookie('linkedin_oauth_state');

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error exchanging code:', err.response?.data || err.message);
    res.status(500).json({ error: 'OAuth failed' });
  }
};

export const postText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { access_token, text, personURN } = req.body;
    if (!text || !access_token || !personURN) {
      res.status(400).json({ error: 'Missing required fields' });
    }

    const linkedin = new LinkedinUtils(access_token, personURN);
    await linkedin.postText(text);

    res.status(200).json({ message: 'Text post published successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const postMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mediaUrls, caption, access_token, personURN } = req.body;
    if (!mediaUrls || !Array.isArray(mediaUrls) || !access_token || !personURN || !caption) {
      res.status(400).json({ error: 'Missing required fields' });
    }

    // Download each file from S3 presigned URL
    const buffers: Buffer[] = await Promise.all(
      mediaUrls.map(async (url: string) => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
      })
    );

    const linkedin = new LinkedinUtils(access_token, personURN);
    await linkedin.postMedia(buffers, caption);

    res.status(200).json({ message: 'Media post published successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
