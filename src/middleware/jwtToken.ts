import jwt, { Secret } from 'jsonwebtoken';
import config from '../config/env';
import { NextFunction, Request, Response } from 'express';
import prisma from '../config/client';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role?: string
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
    return;
  }
};

// Middleware to check for user roles
export const authorizeRoles = (...roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(403).json({ success: false, message: 'Access Denied' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: parseInt(req.user.id) } });
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};


export { generateAccessToken, generateRefreshToken, verifyToken };
