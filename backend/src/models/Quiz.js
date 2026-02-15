import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [String], validate: [(arr) => arr.length === 4, 'Must provide exactly 4 options'] },
    correctAnswer: { type: Number, min: 0, max: 3, required: true },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    questions: { type: [quizQuestionSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
