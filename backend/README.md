# EduPulse Backend (Node.js + Express + MongoDB)

## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Gemini API (`@google/generative-ai`) for AI quiz generation

## 1) Setup
1. `cd backend`
2. `cp .env.example .env` (on Windows PowerShell: `Copy-Item .env.example .env`)
3. Fill `.env` values (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`)
4. `npm install`
5. `npm run dev`

Server runs on `http://localhost:5000` by default.

## 2) API Endpoints
### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
  - body: `{ "name", "email", "password", "role": "professor|student" }`
- `POST /api/auth/login`
  - body: `{ "email", "password" }`
- `GET /api/auth/me` (Bearer token)

### Quiz (Professor)
- `POST /api/quizzes/generate` (Bearer professor)
  - body: `{ "topic", "notes", "difficulty", "questionCount" }`
- `POST /api/quizzes` (Bearer professor)
  - body: `{ "title", "topic", "difficulty", "questions", "assignedTo" }`
- `GET /api/quizzes/professor/me` (Bearer professor)

### Quiz (Student)
- `GET /api/quizzes/student/me` (Bearer student)
- `GET /api/quizzes/:id` (Bearer student/professor with access)

### Attempts
- `POST /api/attempts/:quizId` (Bearer student)
  - body: `{ "answers": [0,1,2], "durationSeconds": 95 }`
- `GET /api/attempts/student/me` (Bearer student)

### Leaderboard
- `GET /api/leaderboard` (Bearer token)

## 3) Frontend Integration Notes
Use `Authorization: Bearer <token>` after login.
Suggested Angular base URL: `http://localhost:5000/api`.

## 4) Gemini Fallback
If `GEMINI_API_KEY` is missing or generation fails, backend automatically uses fallback question generation.
