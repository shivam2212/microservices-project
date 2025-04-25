import { Router } from 'express';
import { createUser, getUserById, getAllUsers, updateUser } from '../controllers/user.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes protected by admin authentication
router.use(authenticateToken, authorizeAdmin);

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);

export default router;