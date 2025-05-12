import { Router } from 'express';
import { getMe } from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/me', getMe);

export default userRouter;
