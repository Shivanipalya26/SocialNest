import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { AuthRequest } from '../types';

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.userId = decoded as string;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token' });
  }
};
