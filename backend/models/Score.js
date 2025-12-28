const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  points: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
