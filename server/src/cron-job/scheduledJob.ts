import cron from 'node-cron';
import prisma from '../config/prisma.config';
import { postPublisher } from '../utils/postPublisher';

cron.schedule('*/3 * * * *', async () => {
  console.log('Checking for scheduled posts...');

  const now = new Date();
  const bufferTime = new Date(now.getTime() - 3 * 60 * 1000);
  const scheduledPosts = await prisma.post.findMany({
    where: {
      status: 'PENDING',
      isScheduled: true,
      scheduledFor: {
        lte: now,
        gte: bufferTime,
      },
    },
    take: 10,
  });

  for (const post of scheduledPosts) {
    try {
      await postPublisher({
        provider: post.provider!,
        postText: post.text!,
        mediaKeys: post.mediaAllKeys,
        userId: post.userId,
        postId: post.id,
      });
      // console.log(`Posted: ${post.id}`);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Failed to post ${post.id}:`, err);
      }
    }
  }
});
