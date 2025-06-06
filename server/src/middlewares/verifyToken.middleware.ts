import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { AuthRequest } from '../types';

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log('token: ', token);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };

    req.userId = decoded.id as string;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};
