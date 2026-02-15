import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getLeaderboard);

export default router;
