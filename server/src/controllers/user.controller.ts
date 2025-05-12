import { Response } from 'express';
import { AuthRequest } from '../types';

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  res.json({ userId });
};
