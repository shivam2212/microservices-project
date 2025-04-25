import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setServiceName, logger } from '../../common/src/utils/logger';
import { connectDB } from '../../common/src/utils/db';
import walletRoutes from './routes/wallet.routes';
import dotenv from 'dotenv'

// Set service name for logging
setServiceName('wallet-service');

// Load env variables
dotenv.config({ path: '../.env' });

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/wallets', walletRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 3003;
const DB_NAME = process.env.WALLET_DB_NAME || 'wallet_service';

const startServer = async () => {
  try {
    await connectDB(DB_NAME);
    app.listen(PORT, () => {
      logger.info(`Wallet service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start wallet service:', error);
    process.exit(1);
  }
};

startServer();