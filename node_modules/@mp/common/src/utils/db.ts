import mongoose from 'mongoose';
import { logger } from './logger';

export async function connectDB(dbName: string): Promise<void> {
  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    await mongoose.connect(`${MONGO_URI}/${dbName}`);
    logger.info(`Connected to MongoDB: ${dbName}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function createDatabase(userId: string): Promise<void> {
  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = `sparkup_${userId}`;
    
    // Connect to admin database to create new database
    const adminConn = await mongoose.createConnection(`${MONGO_URI}/admin`);
    await adminConn.db?.admin().command({ create: dbName });
    await adminConn.close();
    
    logger.info(`Created new database: ${dbName}`);
  } catch (error) {
    logger.error('Database creation error:', error);
    throw error;
  }
}

export function getDBName(userId: string): string {
  return `sparkup_${userId}`;
}