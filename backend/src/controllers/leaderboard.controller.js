import { Attempt } from '../models/Attempt.js';

export async function getLeaderboard(req, res) {
  try {
    const leaderboard = await Attempt.aggregate([
      {
        $group: {
          _id: '$studentId',
          totalPoints: { $sum: '$score' },
          totalQuestions: { $sum: '$total' },
          quizzesTaken: { $sum: 1 },
          lastActive: { $max: '$submittedAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          studentId: '$_id',
          studentName: '$student.name',
          totalPoints: 1,
          quizzesTaken: 1,
          accuracy: {
            $cond: [{ $eq: ['$totalQuestions', 0] }, 0, { $multiply: [{ $divide: ['$totalPoints', '$totalQuestions'] }, 100] }]
          },
          lastActive: 1
        }
      },
      { $sort: { totalPoints: -1, accuracy: -1 } }
    ]);

    return res.json(leaderboard.map((entry) => ({ ...entry, accuracy: Math.round(entry.accuracy) })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
