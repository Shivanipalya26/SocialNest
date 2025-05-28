import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config/config';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import xRouter from './routes/x.routes';
import linkedinRouter from './routes/linkedin.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/x', xRouter);
app.use('/api/linkedin', linkedinRouter);

app.listen(PORT, () => console.log(`Server listening at Port: ${PORT}`));
