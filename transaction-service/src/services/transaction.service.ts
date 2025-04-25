import mongoose from 'mongoose';
import axios from 'axios';
import { getDBName } from '../../../common/src/utils/db';
import { createModels } from '../../../common/src/models';
import { NotFoundError, ValidationError } from '../../../common/src/utils/error';
import { logger } from '../../../common/src/utils/logger';
import { Transaction } from '../../../common/src/interfaces';

// Send transaction request to queue
export const sendTransactionToQueue = async (transactionData: any): Promise<void> => {
  try {
    // Call queue service API to send message
    await axios.post(`${process.env.QUEUE_SERVICE_URL}/api/queue/produce`, {
      queueName: 'transaction_queue',
      message: JSON.stringify(transactionData)
    });
    
    logger.info(`Transaction sent to queue: ${transactionData.userId}`);
  } catch (error) {
    logger.error('Error sending transaction to queue:', error);
    throw new Error('Failed to queue transaction');
  }
};

// Create transaction in user's database
export const createTransaction = async (transactionData: any): Promise<Transaction> => {
  const { userId, amount, serviceCharge, gst, prevBalance, updatedBalance, serviceId, status } = transactionData;
  
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const transaction = new models.Transaction({
    userId,
    amount,
    serviceCharge,
    gst,
    prevBalance,
    updatedBalance,
    serviceId,
    status: status || 'initiated'
  });
  
  await transaction.save();
  await conn.close();
  
  return transaction;
};

// Get transactions for a user
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const transactions = await models.Transaction.find({ userId }).sort({ createdAt: -1 });
  
  await conn.close();
  
  return transactions;
};

// Update transaction status
export const updateTransactionStatus = async (
  userId: string,
  transactionId: string,
  status: 'initiated' | 'awaited' | 'success' | 'failed'
): Promise<Transaction> => {
  const dbName = getDBName(userId);
  const conn = await mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
  const models = createModels(conn);
  
  const transaction = await models.Transaction.findByIdAndUpdate(
    transactionId,
    { status },
    { new: true }
  );
  
  await conn.close();
  
  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }
  
  return transaction;
};