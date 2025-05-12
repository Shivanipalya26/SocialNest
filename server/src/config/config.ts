import dotenv from 'dotenv';
dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '5000');
export const JWT_SECRET = process.env.JWT_SECRET;
