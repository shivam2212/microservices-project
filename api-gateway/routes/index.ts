import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Microservices API Gateway',
    version: '1.0.0',
    services: [
      { name: 'Auth Service', endpoint: '/auth' },
      { name: 'User Service', endpoint: '/users' },
      { name: 'Wallet Service', endpoint: '/wallet' },
      { name: 'Service Charge Service', endpoint: '/service' },
      { name: 'Transaction Service', endpoint: '/transaction' },
    ],
  });
});

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});

router.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
  res.status(200).json({
    message: 'Welcome, admin',
    user: req.user,
  });
});

export default router;
