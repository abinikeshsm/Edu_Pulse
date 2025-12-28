const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  q: String,
  a: String,
  b: String,
  c: String,
  d: String,
  correct: String
});

const QuizSchema = new Schema({
  professorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topic: { type: String, required: true, index: true },
  questions: [QuestionSchema],
  public: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
