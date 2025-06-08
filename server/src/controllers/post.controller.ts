import { Response } from 'express';
import { AuthRequest, PostsResponse } from '../types';
import prisma from '../config/prisma.config';
import { postPublisher } from '../utils/postPublisher';
import { POST_STATUS } from '@prisma/client';
import { createNotification } from '../utils/notification';
import { startOfMonth, endOfMonth } from 'date-fns';

export const postController = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const loggedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });
    if (!loggedUser) {
      res.status(400).json({ msg: 'User not found' });
      return;
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const postThisMonth = await prisma.post.count({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    if (postThisMonth >= 15) {
      res
        .status(403)
        .json({
          error:
            'Monthly post limit reached. You can create up to 5 posts per month on the free plan.',
        });
      return;
    }
    console.log('post this month, ', postThisMonth);

    const fields = req.fields as unknown as {
      postText: string;
      providers: string;
      scheduleAt?: string;
      mediaKeys: string;
    };

    const { postText, providers, scheduleAt, mediaKeys } = fields;

    const parsedProviders = JSON.parse(providers || '[]');
    const parsedMediaKeys = JSON.parse(mediaKeys || '[]');

    if (parsedProviders.length === 0) {
      res.status(400).json({ error: 'Please select at least one provider' });
      return;
    }

    if (!postText && parsedMediaKeys.length === 0) {
      res.status(400).json({ error: 'Please enter text or upload media' });
      return;
    }

    const results = await Promise.allSettled(
      parsedProviders.map(async (provider: string) => {
        const post = await prisma.post.create({
          data: {
            userId,
            text: postText,
            provider: provider,
            mediaAllKeys: parsedMediaKeys,
            status: POST_STATUS.PENDING,
            scheduledFor: scheduleAt ? new Date(scheduleAt) : null,
            isScheduled: !!scheduleAt,
          },
        });

        if (!scheduleAt) {
          await postPublisher({
            provider,
            postText,
            mediaKeys: parsedMediaKeys,
            userId,
            postId: post.id,
          });
        }

        await createNotification({
          message: `Your post to ${provider} is being processed.`,
          type: 'POST_STATUS_PROCESSING',
          userId: loggedUser.id as string,
          postId: post.id,
        });

        return post;
      })
    );
    res.status(200).json({ msg: 'Post created', results });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('PostController Error:', error);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPostsController = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const status = req.query.status as POST_STATUS | undefined;
    const validStatuses = Object.values(POST_STATUS);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };
    if (status && validStatuses.includes(status)) {
      where.status = status;
    }

    // Fetch posts for user
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        text: true,
        status: true,
        isScheduled: true,
        createdAt: true,
        mediaAllKeys: true,
        provider: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Categorize posts
    const finalPosts: PostsResponse = posts.reduce(
      (acc, post) => {
        const formattedPost = {
          ...post,
          text: post.text ?? undefined,
        };

        if (post.isScheduled) acc.ScheduledPosts.push(formattedPost);
        if (post.status === POST_STATUS.PENDING) acc.PendingPosts.push(formattedPost);
        if (post.status === POST_STATUS.FAILED) acc.FailedPosts.push(formattedPost);
        if (post.status === POST_STATUS.SUCCESS) acc.SuccessPosts.push(formattedPost);

        return acc;
      },
      {
        ScheduledPosts: [],
        PendingPosts: [],
        FailedPosts: [],
        SuccessPosts: [],
      } as PostsResponse
    );

    res.status(200).json(finalPosts);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getPostsController Error:', error.message);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
