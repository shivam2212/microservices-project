import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../../../common/src/models';
import { generateToken } from '../../../common/src/utils/auth';
import { AuthenticationError, ValidationError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }
    
    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    const token = generateToken({ id: admin._id?.toString() || '', role: admin.role });
    
    res.status(200).json({
      success: true,
      data: { token, role: admin.role }
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Request via API-Gateway Incoming');
    const { username, password, role } = req.body;
    
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }
    
    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      throw new ValidationError('Username already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new AdminUser({
      username,
      password: hashedPassword,
      role: role || 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully'
    });
  } catch (error) {
    next(error);
  }
};