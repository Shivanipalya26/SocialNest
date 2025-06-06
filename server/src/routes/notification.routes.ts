import { Router } from 'express';
import {
  clearAllNotification,
  deleteNotification,
  getAllNotification,
  markAllNotificationsAsRead,
  updateNotification,
} from '../controllers/notification.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const notifyRouter = Router();

notifyRouter.get('/', verifyToken, getAllNotification);
notifyRouter.post('/', verifyToken, updateNotification);
notifyRouter.put('/', verifyToken, markAllNotificationsAsRead);
notifyRouter.delete('/clear', verifyToken, clearAllNotification);
notifyRouter.delete('/:notificationId', verifyToken, deleteNotification);

export default notifyRouter;
