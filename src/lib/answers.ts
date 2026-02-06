// I wanna track how many times I've answered a question correctly or incorrectly, so I can see which topics I need to focus on more. I also wanna be able to see my progress over time, like how many questions I've answered correctly each day or week. Maybe I can even set some goals for myself, like answering a certain number of questions correctly each week, and then track my progress towards those goals. It would be great if I could see some stats or graphs that show me how I'm doing and where I need to improve.

import type { PieChartProps } from "@/components/Progress"
import { fetchQuestions } from "./fetchQuestions"

export interface Answer {
  question_id: string
  score: number
}

export function saveAnswer(question_id: string, score: number) {
  const existingAnswers = JSON.parse(localStorage.getItem('answers') || '{}') as Record<string, Answer>
  if (existingAnswers[question_id]) {
    // If the question has already been answered, we can choose to either update the existing record or keep it as is. For now, let's update it with the new answer and score.
    existingAnswers[question_id] = {
      question_id,
      score,
    }
  } else {
    // If it's a new answer, just add it to the existing answers
    existingAnswers[question_id] = {
      question_id,
      score,
    }
  }
  localStorage.setItem('answers', JSON.stringify(existingAnswers))
}

export function getAnswers(): Record<string, Answer> {
  return JSON.parse(localStorage.getItem('answers') || '{}') as Record<string, Answer>
}

export function getAnswerByQuestionId(question_id: string): Answer | null {
  const answers = getAnswers()
  return answers[question_id] || null
}

export function clearAnswers() {
  localStorage.removeItem('answers')
}

export async function getProgressStats(): Promise<PieChartProps['data']> {
  const answers = getAnswers()
  const stats = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
  }

  for (const question_id in answers) {
    const answer = answers[question_id]
    if (answer.score > 0) {
      stats.correct += 1
    } else if (answer.score < 0) {
      stats.incorrect += 1
    }
  }

  const questions = await fetchQuestions()

  // Assuming we have a total of 100 questions for simplicity, we can calculate unanswered questions
  const totalQuestions = questions.length // This function should return the total number of questions available
  stats.unanswered = totalQuestions - stats.correct - stats.incorrect

  return [
    { name: 'Correct', value: stats.correct, className: 'text-utility-green-600' },
    { name: 'Incorrect', value: stats.incorrect, className: 'text-red-600' }, // make this redder to stand out more
    { name: 'Unanswered', value: stats.unanswered, className: 'text-utility-gray-200' },
  ]
}
