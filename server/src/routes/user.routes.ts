import { Router } from 'express';
import {
  disconnectApps,
  getConnectedApps,
  getMe,
  getPresignedUrl,
  getUser,
} from '../controllers/user.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const userRouter = Router();

userRouter.get('/me', verifyToken, getMe);
userRouter.get('/dashboard', verifyToken, getUser);
userRouter.get('/apps', verifyToken, getConnectedApps);
userRouter.delete('/disconnect', verifyToken, disconnectApps);
userRouter.post('/presign', verifyToken, getPresignedUrl);

export default userRouter;
