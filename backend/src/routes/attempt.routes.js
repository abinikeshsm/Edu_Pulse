import { Router } from 'express';
import { getMyAttempts, submitAttempt } from '../controllers/attempt.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/:quizId', authMiddleware, requireRole('student'), submitAttempt);
router.get('/student/me', authMiddleware, requireRole('student'), getMyAttempts);

export default router;
