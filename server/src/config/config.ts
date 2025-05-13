import dotenv from 'dotenv';
dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '5000');
export const JWT_SECRET = process.env.JWT_SECRET;
export const X_API_KEY = process.env.X_API_KEY as string;
export const X_API_KEY_SECRET = process.env.X_API_KEY_SECRET as string;
