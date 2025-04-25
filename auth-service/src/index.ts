import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setServiceName, logger } from '@common/utils/logger';
import { connectDB } from '@common/utils/db';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv'

// Set service name for logging
setServiceName('auth-service');

// Load env variables
dotenv.config({ path: '../.env' });

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.get('/', (req, res) => {
  res.send('Your Node.js API is running successfully!');
});

// Start server
const PORT = process.env.PORT || 3001;
const DB_NAME = process.env.AUTH_DB_NAME || 'auth_service';

const startServer = async () => {
  try {
    await connectDB(DB_NAME);
    app.listen(PORT, () => {
      logger.info(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start auth service:', error);
    process.exit(1);
  }
};

startServer();