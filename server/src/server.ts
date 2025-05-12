import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/config';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => console.log(`Server listening at Port: ${PORT}`));
