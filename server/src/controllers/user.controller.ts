import { Response } from 'express';
import { AuthRequest, XUser } from '../types';
import prisma from '../config/prisma.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../utils/s3';
import { decryptToken } from '../utils/crypto';
import { TwitterClient } from '../utils/twitterUtils/twitterUtils';

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching user:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        accounts: true,
        posts: {
          where: {
            createdAt: { gte: oneYearAgo },
            status: 'SUCCESS',
          },
          select: {
            createdAt: true,
            provider: true,
            status: true,
          },
        },
      },
    });

    console.log('user: ', user);

    if (!user) {
      res.status(404).json({ error: 'user not found' });
      return;
    }

    const xAccount = user.accounts.find(account => account.provider === 'x');

    let xUserDetails = null;
    let selectedXUserDetails: XUser | null = null;
    if (xAccount) {
      const xAccessToken = decryptToken(xAccount.access_token!, xAccount.access_token_iv!);

      const xAccessTokenSecret = decryptToken(
        xAccount.access_token_secret!,
        xAccount.access_token_secret_iv!
      );

      const x = new TwitterClient(xAccessToken, xAccessTokenSecret);

      xUserDetails = await x.getTwitterUserDetails();
      if (!xUserDetails) {
        res.status(500).json({ error: 'Failed to fetch X user details' });
        return;
      }

      selectedXUserDetails = {
        id: xUserDetails.id,
        name: xUserDetails.name,
        screen_name: xUserDetails.screen_name,
        location: xUserDetails.location,
        description: xUserDetails.description,
        url: xUserDetails.url,
        profile_image_url: xUserDetails.profile_image_url,
        followers_count: xUserDetails.followers_count,
        friends_count: xUserDetails.friends_count,
        createdAt: xUserDetails.created_at,
        verified: xUserDetails.verified,
        profile_image_url_https: xUserDetails.profile_image_url_https,
        profile_banner_url: xUserDetails.profile_banner_url,
        profile_background_color: xUserDetails.profile_background_color,
      };

      type Provider = 'x' | 'linkedin' | 'instagram';

      const monthlyData: {
        [key: string]: {
          month: string;
          x: number;
          linkedin: number;
          instagram: number;
        };
      } = {};

      user.posts.forEach(post => {
        const month = post.createdAt.toLocaleString('default', {
          month: 'short',
        });

        const provider = post.provider as Provider;

        if (!monthlyData[month]) {
          monthlyData[month] = { month, x: 0, linkedin: 0, instagram: 0 };
        }

        if (provider in monthlyData[month]) {
          monthlyData[month][provider] += 1;
        }
      });

      const result = Object.values(monthlyData).reverse();

      const dashboardData = {
        xUserDetails: selectedXUserDetails || null,
        monthlyData: result,
      };

      res.status(200).json({ dashboardData });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Failed to fetch dashboard data: ${error.message}` });
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching user:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConnectedApps = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const connectedApps = await prisma.account.findMany({
      where: { userId },
      select: {
        provider: true,
        providerAccountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ connectedApps });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching connected apps:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const disconnectApps = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { provider, providerAccountId } = req.body;

  if (!userId || !provider || !providerAccountId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await prisma.account.delete({
      where: {
        userId: userId,
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });

    res.status(200).json({ message: 'Account disconnected successfully' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Disconnect error:', error);
    }
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
};

export const getPresignedUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const userId = req.userId;

    if (!fileName || !fileType || !fileSize) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const MAX_FILE_SIZE = 200 * 1024 * 1024;
    if (fileSize > MAX_FILE_SIZE) {
      res.status(400).json({ error: 'File size exceeds 200MB limit' });
      return;
    }

    const key = `media/${userId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    res.status(200).json({ url: presignedUrl, key });
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Presign error:', error);
    }
    res.status(500).json({ error: 'Failed to generate presigned URL' });
    return;
  }
};
