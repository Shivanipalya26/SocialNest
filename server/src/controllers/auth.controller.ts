import { Response } from 'express';
import { AuthRequest } from '../types';
import bcryptjs from 'bcryptjs';
import { loginSchema, registerSchema } from '../zod/zod';
import prisma from '../config/prisma.config';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const { success, error } = registerSchema.safeParse({ name, email, password });

    if (!success) {
      res.status(400).json({ error: error.flatten().fieldErrors });
    }

    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail) res.status(400).json({ error: 'Email already reigstered' });

    const existingName = await prisma.user.findFirst({ where: { name } });
    if (existingName) res.status(400).json({ error: 'Username already taken' });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log(user, 'registered successfully');

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { success, error } = loginSchema.safeParse({ email, password });

    if (!success) {
      res.status(400).json({ error: error.flatten().fieldErrors });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(404).json({ error: 'Invalid Credentials' });
      return;
    }

    const validPassword = await bcryptjs.compare(password, user?.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid Password' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET as string, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    console.error('Login Error: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};
