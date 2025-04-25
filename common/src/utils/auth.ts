import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in environment');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): TokenPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in environment');
  }
  const secret = process.env.JWT_SECRET || 'default_secret_key';
  return jwt.verify(token, secret) as TokenPayload;
};