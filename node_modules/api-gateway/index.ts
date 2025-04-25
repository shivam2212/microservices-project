import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { logger } from '../common/src/utils/logger';
import { authenticateToken, authorizeAdmin } from './middleware/auth.middleware';
import routes from './routes';
import type { ClientRequest } from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Mount base routes (health, info, protected routes)
app.use('/', routes);

// Microservices proxy configuration
const services = [
  {
    path: '/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    auth: false,
    authorization: false,
    rewrite: '^/auth',  // rewrite to /api/auth
    forwardTo: '/api/auth'
  },
  {
    path: '/users',
    target: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    auth: true,
    authorization: false,
    rewrite: '^/users',
    forwardTo: ''
  },
  {
    path: '/wallet',
    target: process.env.WALLET_SERVICE_URL || 'http://localhost:3003',
    auth: true,
    authorization: true,
    rewrite: '^/wallet',
    forwardTo: ''
  },
  {
    path: '/service',
    target: process.env.SERVICE_CHARGE_SERVICE_URL || 'http://localhost:3004',
    auth: true,
    authorization: true,
    rewrite: '^/service',
    forwardTo: ''
  },
  {
    path: '/transaction',
    target: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3005',
    auth: true,
    authorization: true,
    rewrite: '^/transaction',
    forwardTo: ''
  },
];

// Setup proxy with authentication and authorization middleware
services.forEach(({ path, target, auth, authorization, rewrite, forwardTo }) => {
  const middlewares = [];

  if (auth) {
    middlewares.push(authenticateToken);
  }

  if (authorization) {
    middlewares.push(authorizeAdmin);
  }

  logger.info(`Proxy setup: ${path} -> ${target}${forwardTo}`);

  middlewares.push(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [rewrite]: forwardTo
      },
      onProxyReq: (proxyReq: ClientRequest, req: Request) => {
        console.log(`Proxying request ${req.originalUrl} to ${target}${req.url}`);
        if ((req as any).user) {
          proxyReq.setHeader('X-User-Id', (req as any).user.id);
          proxyReq.setHeader('X-User-Role', (req as any).user.role);
        }
      },
      logLevel: 'debug',
      onError: (err: Error, req: Request, res: Response) => {
        logger.error(`Proxy error on ${req.url}: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Proxy error occurred' });
        }
      },
    } as Options)
  );

  app.use(path, ...middlewares);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API Gateway is running' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message || err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  }
});

const PORT = process.env.API_GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
