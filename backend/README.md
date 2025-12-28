# EduPulse AI - Backend

This is the Express backend for EduPulse AI.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Run dev server: `npm run dev`.

API Endpoints

- `GET /api/health` - health check
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login
- `POST /api/quizzes/generate` - generate a quiz (professor)
- `POST /api/quizzes/:id/submit` - submit quiz answers (student)
- `GET /api/quizzes/:id/leaderboard` - get leaderboard for quiz

Note: Gemini API calls are mocked in development by `services/gemini.js`.

**Important:** If you want to run `npm run seed` or start the server locally, ensure MongoDB is running on `localhost:27017` or set `MONGO_URI` in your `.env` to a MongoDB Atlas URI.
