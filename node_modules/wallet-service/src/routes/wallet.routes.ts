import { Router } from 'express';
import { getWallet, topUpWallet } from '../controllers/wallet.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/:userId', getWallet);
router.post('/:userId/:topup', authorizeAdmin, topUpWallet);

export default router;