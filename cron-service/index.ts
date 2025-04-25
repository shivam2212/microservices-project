import express from 'express';
import { json } from 'body-parser';
import cron from 'node-cron';
import { connectDB } from '@common/utils/db';
import { initCronJobs } from './cron';
import { setServiceName, logger } from '@common/utils/logger';
import dotenv from 'dotenv'



// Load env variables
dotenv.config({ path: '../.env' });

setServiceName('cron-service');

const app = express();
app.use(json());

const PORT = process.env.CRON_SERVICE_PORT || 3007;
const DB_NAME = process.env.SERVICE_DB_NAME || 'cron_service';

// Initialize database connection
connectDB(DB_NAME);

// Initialize cron jobs
initCronJobs();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Cron service is running' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Cron service running on port ${PORT}`);
});