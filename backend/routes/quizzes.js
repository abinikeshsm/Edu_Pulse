const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateQuiz, listQuizzes, getQuiz, submitQuiz, getLeaderboard } = require('../controllers/quizController');

router.post('/generate', auth, generateQuiz);
router.get('/', auth, listQuizzes);
router.get('/:id', auth, getQuiz);
router.post('/:id/submit', auth, submitQuiz);
router.get('/:id/leaderboard', auth, getLeaderboard);

module.exports = router;