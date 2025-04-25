import { Router } from 'express';
import { assignServiceToUser, getService } from '../controllers/service.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes protected by authentication
router.use(authenticateToken);

router.post('/assign', authorizeAdmin, assignServiceToUser);
router.get('/:userId/:serviceId', getService);

export default router;