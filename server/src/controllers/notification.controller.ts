import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/prisma.config';

export const getAllNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });
    console.log('notif: ', notifications);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Notification error: ', error);
    res.status(500).json({ error });
  }
};

export const updateNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { notificationId } = req.body;

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.status(200).json({ notification });
  } catch (error) {
    console.error('Notification error: ', error);
    res.status(500).json({ error });
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Notification error: ', error);
    res.status(500).json({ error });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { notificationId } = req.params;

  if (!notificationId) {
    res.status(400).json({ error: 'Missing notificationId' });
    return;
  }

  try {
    await prisma.notification.delete({
      where: { id: parseInt(notificationId) },
    });

    console.log('notification deleted');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notification error: ', error);
    res.status(500).json({ error });
    return;
  }
};

export const clearAllNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await prisma.notification.deleteMany({
      where: { userId },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notification error: ', error);
    res.status(500).json({ error });
    return;
  }
};
