import { Attempt } from '../models/Attempt.js';
import { Quiz } from '../models/Quiz.js';

export async function submitAttempt(req, res) {
  try {
    const { quizId } = req.params;
    const { answers = [], durationSeconds = 0 } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const allowed = quiz.assignedTo.some((id) => String(id) === req.user.id);
    if (!allowed) {
      return res.status(403).json({ message: 'Quiz is not assigned to this student' });
    }

    const score = quiz.questions.reduce((acc, question, index) => {
      return acc + (Number(answers[index]) === question.correctAnswer ? 1 : 0);
    }, 0);

    const payload = {
      quizId,
      studentId: req.user.id,
      answers,
      score,
      total: quiz.questions.length,
      durationSeconds,
      submittedAt: new Date()
    };

    const attempt = await Attempt.findOneAndUpdate(
      { quizId, studentId: req.user.id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json(attempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getMyAttempts(req, res) {
  try {
    const attempts = await Attempt.find({ studentId: req.user.id })
      .populate('quizId', 'title topic difficulty')
      .sort({ submittedAt: -1 });
    return res.json(attempts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
