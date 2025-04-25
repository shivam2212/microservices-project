import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setServiceName, logger } from '../../common/src/utils/logger';
import { connectDB } from '../../common/src/utils/db';
import serviceRoutes from './routes/service.routes';
import dotenv from 'dotenv'

// Set service name for logging
setServiceName('service-charge-service');

// Load env variables
dotenv.config({ path: '../.env' });

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/services', serviceRoutes);

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
const PORT = process.env.PORT || 3004;
const DB_NAME = process.env.SERVICE_DB_NAME || 'service_charge_service';

const startServer = async () => {
  try {
    await connectDB(DB_NAME);
    app.listen(PORT, () => {
      logger.info(`Service charge service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start service charge service:', error);
    process.exit(1);
  }
};

startServer();