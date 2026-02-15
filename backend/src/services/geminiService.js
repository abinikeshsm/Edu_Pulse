import { GoogleGenerativeAI } from '@google/generative-ai';
import { fallbackQuizGenerator } from '../utils/fallbackQuizGenerator.js';

function extractJsonBlock(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  return match[0];
}

export async function generateQuizWithGemini({ topic, notes, questionCount = 5, difficulty = 'Medium' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackQuizGenerator(topic, notes, questionCount);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const prompt = `Generate ${questionCount} multiple-choice questions for topic: ${topic}.
Difficulty: ${difficulty}.
Context notes: ${notes}
Return ONLY JSON array. Each item must include:
- prompt (string)
- options (array of 4 strings)
- correctAnswer (number index from 0 to 3)
- explanation (string)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonBlock = extractJsonBlock(text);
    if (!jsonBlock) {
      return fallbackQuizGenerator(topic, notes, questionCount);
    }

    const parsed = JSON.parse(jsonBlock);
    if (!Array.isArray(parsed) || !parsed.length) {
      return fallbackQuizGenerator(topic, notes, questionCount);
    }

    return parsed
      .slice(0, questionCount)
      .filter((q) => typeof q.prompt === 'string' && Array.isArray(q.options) && q.options.length === 4)
      .map((q) => ({
        prompt: q.prompt,
        options: q.options,
        correctAnswer: Number.isInteger(q.correctAnswer) ? q.correctAnswer : 0,
        explanation: q.explanation || ''
      }));
  } catch (error) {
    console.warn('Gemini generation failed, falling back:', error.message);
    return fallbackQuizGenerator(topic, notes, questionCount);
  }
}
