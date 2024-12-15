import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET || 'secret';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, secret, { expiresIn: '15d' });
};
