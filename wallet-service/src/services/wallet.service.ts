import mongoose from 'mongoose';
import { getDBName } from '../../../common/src/utils/db';
import { createModels } from '../../../common/src/models';
import { NotFoundError, ValidationError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';
import { Wallet } from '../../../common/src/interfaces';

// Get wallet by user ID
export const getWalletByUserId = async (userId: string): Promise<Wallet> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const wallet = await models.Wallet.findOne({ userId });
  
  await conn.close();
  
  if (!wallet) {
    throw new NotFoundError('Wallet not found');
  }
  
  return wallet;
};

// Update wallet balance (e.g., top-up)
export const updateWalletBalance = async (
  userId: string, 
  amount: number, 
  operation: 'add' | 'subtract'
): Promise<Wallet> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  // Get current wallet
  const wallet = await models.Wallet.findOne({ userId });
  
  if (!wallet) {
    await conn.close();
    throw new NotFoundError('Wallet not found');
  }
  
  let updateData: Partial<Wallet> = {};
  let newBalance = wallet.balance;
  
  if (operation === 'add') {
    // Top-up logic: First clear any lean amount
    if (wallet.lean > 0) {
      const leanDeduction = Math.min(wallet.lean, amount);
      amount -= leanDeduction;
      updateData.lean = wallet.lean - leanDeduction;
    }
    
    // Add remaining amount to balance
    if (amount > 0) {
      newBalance += amount;
    }
    
    updateData.balance = newBalance;
  } else if (operation === 'subtract') {
    // Check if we can subtract this amount
    const availableBalance = wallet.balance - wallet.hold;
    
    if (amount > availableBalance) {
      await conn.close();
      throw new ValidationError('Insufficient balance');
    }
    
    newBalance -= amount;
    updateData.balance = newBalance;
  }
  
  // Update wallet
  const updatedWallet = await models.Wallet.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true }
  );
  
  await conn.close();
  
  if (!updatedWallet) {
    throw new NotFoundError('Wallet not found');
  }
  
  return updatedWallet;
};

// Check if transaction is valid based on wallet rules
export const validateTransaction = async (userId: string, amount: number): Promise<boolean> => {
  const wallet = await getWalletByUserId(userId);
  
  // Check minimum and maximum limits
  if (amount < wallet.minLimit) {
    throw new ValidationError(`Amount below minimum limit of ${wallet.minLimit}`);
  }
  
  if (amount > wallet.maxLimit) {
    throw new ValidationError(`Amount exceeds maximum limit of ${wallet.maxLimit}`);
  }
  
  // Check available balance
  const availableBalance = wallet.balance - wallet.hold;
  if (amount > availableBalance) {
    throw new ValidationError('Insufficient balance');
  }
  
  return true;
};

// Update wallet for a transaction
export const processWalletTransaction = async (
  userId: string, 
  amount: number,
  serviceCharge: number,
  gst: number
): Promise<{ prevBalance: number; updatedBalance: number }> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const wallet = await models.Wallet.findOne({ userId });
  
  if (!wallet) {
    await conn.close();
    throw new NotFoundError('Wallet not found');
  }
  
  const totalDeduction = amount + serviceCharge + gst;
  const prevBalance = wallet.balance;
  const updatedBalance = prevBalance - totalDeduction;
  
  // Update wallet
  await models.Wallet.updateOne(
    { userId },
    { $set: { balance: updatedBalance } }
  );
  
  await conn.close();
  
  return { prevBalance, updatedBalance };
};