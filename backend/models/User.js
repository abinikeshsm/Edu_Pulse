const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['professor', 'student'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
