import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const userRouter = Router();

userRouter.get('/me', verifyToken, getMe);

export default userRouter;
