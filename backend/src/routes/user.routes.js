import { Router } from 'express';
import { getStudents } from '../controllers/user.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/students', authMiddleware, requireRole('professor'), getStudents);

export default router;
