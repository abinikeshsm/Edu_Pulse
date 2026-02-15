import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [Number], default: [] },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    durationSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

attemptSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

export const Attempt = mongoose.model('Attempt', attemptSchema);
