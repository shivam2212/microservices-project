import { Router } from 'express';
import { initiateTransaction, getTransactions } from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes protected by authentication
router.use(authenticateToken);

router.post('/', initiateTransaction);
router.get('/:userId', getTransactions);

export default router;