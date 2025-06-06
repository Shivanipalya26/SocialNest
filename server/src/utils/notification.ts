import prisma from '../config/prisma.config';

interface CreateNotificationProps {
  message: string;
  type: 'POST_STATUS_PROCESSING' | 'POST_STATUS_SUCCESS' | 'POST_STATUS_FAILED' | 'SYSTEM_ALERT';
  userId: string;
  postId?: string;
}

export const createNotification = async ({
  message,
  type,
  userId,
  postId,
}: CreateNotificationProps) => {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      type,
      postId,
    },
  });
};
