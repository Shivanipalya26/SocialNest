import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', verifyToken, logout);

export default authRouter;
