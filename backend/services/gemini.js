// Mock Gemini service - returns generated MCQs from a text/topic

async function generateQuizFromText(topic, numQuestions = 5) {
  // In production, call Gemini API here using API key in process.env.GEMINI_API_KEY
  // For now we return dummy questions based on the topic
  const sample = [];
  for (let i = 1; i <= numQuestions; i++) {
    sample.push({
      q: `(${topic}) Sample question ${i}?`,
      a: `Option A ${i}`,
      b: `Option B ${i}`,
      c: `Option C ${i}`,
      d: `Option D ${i}`,
      correct: ['a','b','c','d'][i % 4]
    });
  }
  return sample;
}

module.exports = { generateQuizFromText };
