import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../../common/src/utils/auth';
import { AuthenticationError, AuthorizationError } from '../../../common/src/utils/error';

// Extend the express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Access token is required');
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid token'));
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      throw new AuthorizationError('Admin access required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};