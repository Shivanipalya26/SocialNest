// src/jobs/scheduledJobs.ts
import cron from 'node-cron';
import prisma from '../config/prisma.config';
import { postPublisher } from '../utils/postPublisher'; // adjust path if needed

cron.schedule('* * * * *', async () => {
  console.log('Checking for scheduled posts...');

  const now = new Date();
  const scheduledPosts = await prisma.post.findMany({
    where: {
      status: 'PENDING',
      isScheduled: true,
      scheduledFor: {
        lte: now,
      },
    },
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
      console.log(`Posted: ${post.id}`);
    } catch (err) {
      console.error(`Failed to post ${post.id}:`, err);
    }
  }
});
