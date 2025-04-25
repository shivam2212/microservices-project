import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { createDatabase, getDBName } from '../../../common/src/utils/db';
import { createModels } from '../../../common/src/models';
import { ValidationError, NotFoundError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';


// Create user and initialize wallet
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, mobile, userId } = req.body;

    // Validate input
    if (!name || !email || !mobile || !userId) {
      throw new ValidationError('All fields are required');
    }

    // Use models from the main connection
    const mainDB = mongoose.connection;
    const { User: UserModel } = createModels(mainDB);

    // Check if userId already exists
    const existingUser = await UserModel.findOne({ userId });
    if (existingUser) {
      throw new ValidationError('User ID already exists');
    }

    // Create new user
    const newUser = new UserModel({ name, email, mobile, userId });
    await newUser.save();

    // Create dedicated database for user
    await createDatabase(userId);

    // Connect to user's database
    const userDBName = getDBName(userId);
    const userDBConn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${userDBName}`);

    // Create models and wallet
    const userModels = createModels(userDBConn);
    const wallet = new userModels.Wallet({
      userId,
      balance: 10000,
      hold: 100,
      minLimit: 50,
      maxLimit: 5000,
      lean: 200,
    });

    await wallet.save();
    await userDBConn.close();

    res.status(201).json({
      success: true,
      message: 'User created successfully with wallet',
      data: { user: newUser, wallet },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const mainDB = mongoose.connection;
    const { User: UserModel } = createModels(mainDB);

    const user = await UserModel.findOne({ userId });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userDBName = getDBName(userId);
    const userDBConn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${userDBName}`);
    const models = createModels(userDBConn);

    const wallet = await models.Wallet.findOne({ userId });
    await userDBConn.close();

    res.status(200).json({
      success: true,
      data: { user, wallet },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mainDB = mongoose.connection;
    const { User: UserModel } = createModels(mainDB);
    const users = await UserModel.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { name, email, mobile } = req.body;

    const mainDB = mongoose.connection;
    const { User: UserModel } = createModels(mainDB);

    const updatedUser = await UserModel.findOneAndUpdate(
      { userId },
      { name, email, mobile },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
