export function fallbackQuizGenerator(topic, notes, questionCount = 5) {
  const concepts = (notes || topic)
    .split(/[\n,.;]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 3)
    .slice(0, 8);

  const base = concepts.length ? concepts : [topic, 'Active Learning', 'Instant Feedback'];

  return Array.from({ length: questionCount }).map((_, idx) => {
    const concept = base[idx % base.length];
    const correct = `${concept} supports stronger assessment quality through active recall.`;
    const options = [
      correct,
      `${concept} removes the need for formative assessment.`,
      `${concept} is only used for grading hardware performance.`,
      `${concept} has no measurable effect on learning outcomes.`
    ];

    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return {
      prompt: `In ${topic}, which statement best describes ${concept}?`,
      options: shuffled,
      correctAnswer: shuffled.indexOf(correct),
      explanation: `${concept} is useful when paired with timely and adaptive assessment.`
    };
  });
}
