import { Router } from 'express';
import {
  createQuiz,
  generateQuiz,
  getProfessorQuizzes,
  getQuizById,
  getStudentQuizzes
} from '../controllers/quiz.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/generate', authMiddleware, requireRole('professor'), generateQuiz);
router.post('/', authMiddleware, requireRole('professor'), createQuiz);
router.get('/professor/me', authMiddleware, requireRole('professor'), getProfessorQuizzes);
router.get('/student/me', authMiddleware, requireRole('student'), getStudentQuizzes);
router.get('/:id', authMiddleware, getQuizById);

export default router;
