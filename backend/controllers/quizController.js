const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { generateQuizFromText } = require('../services/gemini');

exports.generateQuiz = async (req, res) => {
  try {
    // Only professors can generate
    if (req.user.role !== 'professor') return res.status(403).json({ msg: 'Forbidden' });
    const { topic, numQuestions, public } = req.body;
    if (!topic) return res.status(400).json({ msg: 'Topic required' });

    const questions = await generateQuizFromText(topic, numQuestions || 5);
    const quiz = new Quiz({ professorId: req.user.id, topic, questions, public: public !== false });
    await quiz.save();
    res.json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// List quizzes: students see public quizzes; professors see their own
exports.listQuizzes = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      filter.public = true;
    } else if (req.user.role === 'professor') {
      filter.professorId = req.user.id;
    }
    const quizzes = await Quiz.find(filter).select('topic professorId createdAt updatedAt').sort({ createdAt: -1 }).limit(50).lean();
    res.json({ quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    // Hide correct answers for students or non-owning professors
    let sanitized = quiz;
    if (req.user.role !== 'professor' || (req.user.role === 'professor' && (quiz.professorId.toString() !== req.user.id))) {
      sanitized = { ...quiz, questions: quiz.questions.map(q => {
        const { correct, ...rest } = q;
        return rest;
      })};
    }
    res.json({ quiz: sanitized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    const answers = req.body.answers || {}; // { questionIndex: 'a' }
    let points = 0;
    quiz.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (!ans) return;
      if (ans.toLowerCase() === (q.correct || '').toLowerCase()) points += 1;
    });
    const total = quiz.questions.length;
    const score = new Score({ studentId: req.user.id, quizId: quiz._id, points, total });
    await score.save();
    res.json({ points, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find({ quizId: req.params.id }).populate('studentId', 'name email').sort({ points: -1, createdAt: 1 }).limit(20);
    res.json({ leaderboard: scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};