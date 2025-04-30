import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}

const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id }, config.jwt.jwt_secret as Secret, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, config.jwt.refresh_token_secret as Secret, {
    expiresIn: '7d',
  });
};

const verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
      const decoded = jwt.verify(token, config.jwt.jwt_secret as string) as { id: string };
      req.user = { id: decoded.id };
      next();
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};


export { generateAccessToken, generateRefreshToken, verifyToken };
