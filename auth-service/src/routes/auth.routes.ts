import { Router } from 'express';
import { login, createAdmin } from '../controllers/auth.controller';
import { authenticateToken, authorizeSuperAdmin } from '../middleware/auth.middleware';

const router = Router();


router.post('/login', login);
router.post('/admin', createAdmin);

export default router;