import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config/config';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import xRouter from './routes/x.routes';
import linkedinRouter from './routes/linkedin.routes';
import postRouter from './routes/post.routes';
import './cron-job/scheduledJob';
import notifyRouter from './routes/notification.routes';
import mediaRouter from './routes/media.routes';
import generateRouter from './routes/generate.routes';
import paymentRouter from './routes/payment.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://socialnest.shivanipalya.tech',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/x', xRouter);
app.use('/api/linkedin', linkedinRouter);
app.use('/api/v1/notification', notifyRouter);
app.use('/api/v1/media', mediaRouter);
app.use('/api/v1/generate', generateRouter);
app.use('/api/v1/payment', paymentRouter);

app.listen(PORT, () => console.log(`Server listening at Port: ${PORT}`));
