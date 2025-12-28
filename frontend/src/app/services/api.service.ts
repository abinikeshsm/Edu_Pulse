const API_BASE = '/api';

export async function register(data: any) {
  return fetch(`${API_BASE}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function login(data: any) {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  }).then(r => r.json());
}

export async function generateQuiz(token: string, topic: string) {
  return fetch(`${API_BASE}/quizzes/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ topic })
  }).then(r => r.json());
}

export async function listQuizzes(token?: string) {
  const headers: any = token ? { 'Authorization': `Bearer ${token}` } : {};
  return fetch(`${API_BASE}/quizzes`, { headers }).then(r => r.json());
}

export async function getQuiz(token: string, id: string) {
  return fetch(`${API_BASE}/quizzes/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
}

export async function submitQuiz(token: string, id: string, answers: any) {
  return fetch(`${API_BASE}/quizzes/${id}/submit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ answers })
  }).then(r => r.json());
}

export async function getLeaderboard(token: string, id: string) {
  return fetch(`${API_BASE}/quizzes/${id}/leaderboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
}
