import { Quiz } from '../models/Quiz.js';
import { generateQuizWithGemini } from '../services/geminiService.js';

export async function generateQuiz(req, res) {
  try {
    const { topic, notes, questionCount = 5, difficulty = 'Medium' } = req.body;
    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const questions = await generateQuizWithGemini({ topic, notes, questionCount, difficulty });
    return res.json({ topic, difficulty, questionCount: questions.length, questions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, topic, difficulty = 'Medium', questions = [], assignedTo = [] } = req.body;
    if (!title || !topic || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'title, topic and questions are required' });
    }

    const quiz = await Quiz.create({
      title,
      topic,
      difficulty,
      questions,
      assignedTo,
      createdBy: req.user.id
    });

    return res.status(201).json(quiz);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getProfessorQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getStudentQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find({ assignedTo: req.user.id, isPublished: true }).sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getQuizById(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const isProfessorOwner = req.user.role === 'professor' && String(quiz.createdBy) === req.user.id;
    const isAssignedStudent = req.user.role === 'student' && quiz.assignedTo.some((id) => String(id) === req.user.id);

    if (!isProfessorOwner && !isAssignedStudent) {
      return res.status(403).json({ message: 'Not allowed to access this quiz' });
    }

    return res.json(quiz);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
