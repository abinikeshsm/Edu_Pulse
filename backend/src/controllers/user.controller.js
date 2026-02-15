import { User } from '../models/User.js';

export async function getStudents(_req, res) {
  try {
    const students = await User.find({ role: 'student' }).select('_id name email role').sort({ name: 1 });
    return res.json(
      students.map((student) => ({
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
