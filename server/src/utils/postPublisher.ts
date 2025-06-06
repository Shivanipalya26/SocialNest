import { POST_STATUS } from '@prisma/client';
import prisma from '../config/prisma.config';
import { postMediaToTwitter } from '../services/twitter.services';
import { decryptToken } from './crypto';
import { getFromS3Bucket } from './s3';
import { postMediaToLinkedIn } from '../services/linkedin.services';
import { createNotification } from './notification';

export const postPublisher = async ({
  provider,
  postText,
  mediaKeys,
  userId,
  postId,
}: {
  provider: string;
  postText: string;
  mediaKeys: string[];
  userId: string;
  postId: string;
}) => {
  await prisma.post.findUnique({ where: { id: postId } });
  const loggedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!loggedUser) {
    throw new Error('user not found');
  }

  let postResponse;

  try {
    const mediaBuffers = await Promise.all(mediaKeys.map(async key => await getFromS3Bucket(key)));

    if (provider === 'x') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xAccount = loggedUser.accounts.find((acc: any) => acc.provider === 'x');

      if (!xAccount) {
        throw new Error(`${provider} account not found`);
      }

      if (!xAccount.access_token || !xAccount.access_token_iv) {
        throw new Error('x access token not found.');
      }

      if (!xAccount.access_token_secret || !xAccount.access_token_secret_iv) {
        throw new Error('x access token secret not found.');
      }
      console.log('x: ', xAccount);

      const decryptedAccessToken = decryptToken(xAccount.access_token, xAccount.access_token_iv);

      const decryptedAccessTokenSecret = decryptToken(
        xAccount.access_token_secret,
        xAccount.access_token_secret_iv
      );

      postResponse = await postMediaToTwitter({
        caption: postText,
        mediaBuffers,
        access_token: decryptedAccessToken,
        access_token_secret: decryptedAccessTokenSecret,
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          status: POST_STATUS.SUCCESS,
        },
      });
      // return postResponse;
    } else if (provider === 'linkedin') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const linkedinAccount = loggedUser.accounts.find((acc: any) => acc.provider === 'linkedin');

      if (!linkedinAccount) {
        throw new Error(`${provider} account not found`);
      }

      if (!linkedinAccount.access_token || !linkedinAccount.access_token_iv) {
        throw new Error('linkeding access token not found.');
      }

      const decryptedAccessToken = decryptToken(
        linkedinAccount.access_token,
        linkedinAccount.access_token_iv
      );

      const { providerAccountId } = linkedinAccount;
      console.log('linkedin ', linkedinAccount);

      const postResponse = await postMediaToLinkedIn({
        caption: postText,
        access_token: decryptedAccessToken,
        personURN: providerAccountId,
        mediaBuffers,
      });

      console.log('postres:', postResponse);

      await prisma.post.update({
        where: { id: postId },
        data: {
          status: POST_STATUS.SUCCESS,
        },
      });
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    console.log('hello');

    const notifications = await prisma.notification.updateMany({
      where: {
        postId: postId,
        type: 'POST_STATUS_PROCESSING',
      },
      data: {
        type: 'POST_STATUS_SUCCESS',
        message: `Your post to ${provider} was successfully published.`,
      },
    });
    console.log('Matching notifications:', notifications);

    return { provider, response: postResponse };
  } catch (error) {
    console.error('Post publish failed:', error);

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: POST_STATUS.FAILED,
      },
    });

    await createNotification({
      message: `Your post to ${provider} was failed.`,
      type: 'POST_STATUS_FAILED',
      userId,
    });
    throw error;
  }
};
