import express from 'express';
import { json } from 'body-parser';
import { setServiceName, logger } from '@common/utils/logger';
import dotenv from 'dotenv'



// Load env variables
dotenv.config({ path: '../.env' });

setServiceName('dummy-bank-api');

const app = express();
app.use(json());

const PORT = process.env.DUMMY_BANK_API_PORT || 3008;

// Simulated bank API endpoint
app.post('/process', (req, res) => {
  const { transactionId, amount, userId } = req.body;
  
  // Log the request
  logger.info(`Received transaction: ${transactionId} for user ${userId} with amount ${amount}`);
  
  // Simulate processing delay (0.5-1.5 seconds)
  const delay = Math.floor(Math.random() * 1000) + 500;
  
  setTimeout(() => {
    // Success response (could add random failures if needed)
    if (Math.random() > 0.05) { // 95% success rate
      logger.info(`Transaction ${transactionId} acknowledged`);
      res.status(200).json({
        status: 'acknowledged',
        transactionId,
        processedAt: new Date().toISOString()
      });
    } else {
      // Simulated failure
      logger.warn(`Transaction ${transactionId} failed`);
      res.status(500).json({
        status: 'failed',
        transactionId,
        error: 'Simulated bank processing error'
      });
    }
  }, delay);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Dummy bank API is running' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Dummy bank API running on port ${PORT}`);
});