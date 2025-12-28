const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/edupulse';

async function run() {
  await mongoose.connect(mongoUri);
  console.log('Connected to DB');

  const users = [
    { name: 'Professor Alice', email: 'prof@example.com', password: 'password', role: 'professor' },
    { name: 'Student Bob', email: 'student@example.com', password: 'password', role: 'student' }
  ];

  for (const u of users) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(u.password, salt);
      user = new User({ name: u.name, email: u.email, password: hash, role: u.role });
      await user.save();
      console.log('Created user', u.email);
    } else {
      console.log('User exists', u.email);
    }
  }
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });