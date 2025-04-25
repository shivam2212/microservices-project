import cron from 'node-cron';
import { logger } from '../common/src/utils/logger';
import { createModels } from '../common/src/models'; // Import createModels
import mongoose from 'mongoose';  // Import mongoose for DB connection

export const initCronJobs = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    await updateAwaitedTransactions();
  });

  logger.info('Cron jobs initialized');
};

/**
 * Updates transactions with "awaited" status to "success"
 */
const updateAwaitedTransactions = async () => {
  try {
    const startTime = Date.now();
    logger.info('Running cron job: updateAwaitedTransactions');

    // Create models (use the existing MongoDB connection here)
    const conn = await mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017');
    const { Transaction } = createModels(conn);

    // Find all transactions with "awaited" status and update them to "success"
    const result = await Transaction.updateMany(
      { status: 'awaited' },
      { $set: { status: 'success', updatedAt: new Date() } }
    );

    const duration = Date.now() - startTime;
    logger.info(`Updated ${result.modifiedCount} transactions to "success" status in ${duration}ms`);
    await conn.close();  // Close the connection after use
  } catch (error) {
    logger.error('Error in updateAwaitedTransactions cron job:', error);
  }
};
