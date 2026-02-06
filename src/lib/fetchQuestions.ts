import z from "zod"
import { getAnswers } from "./answers";




export const QuestionSchema = z.object({
    theme_number: z.string(),
    theme_name: z.string(),
    chapter_number: z.string(),
    chapter_name: z.string(),
    question_id: z.string(),
    question_number: z.string(),
    points: z.string(),
    question_text: z.string(),
    options: z.array(
    z.object({
        letter: z.string(),
        text: z.string(),
    }),
    ),
    correct_answers: z.array(
    z.object({
        letter: z.string(),
        text: z.string(),
    }),
    ),
    comment: z.string(),
    image_urls: z.array(z.string()),
    local_image_paths: z.array(z.string()),
    video_urls: z.array(z.string()),
    local_video_paths: z.array(z.string()),
    url: z.string(),
  })

export const QuestionsSchema = z.array(QuestionSchema);

export type QuestionsType = z.infer<typeof QuestionsSchema>
export type QuestionType = z.infer<typeof QuestionSchema>

export function fetchQuestions(): Promise<QuestionsType> {
  return fetch('/questions/driving_theory_questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }

      return response.json().then(data => {
        return QuestionsSchema.parse(data)
      })
    })
};

export function fetch30RandomUnansweredQuestions(): Promise<QuestionsType> {
  return fetch('/questions/driving_theory_questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }
      return response.json().then((data: unknown) => {
        const questions = QuestionsSchema.parse(data)
        const answers = getAnswers()

        // Filter out questions that have already been answered
        const unansweredQuestions = questions.filter(question => !answers[question.question_id])

        // Shuffle the unanswered questions and take the first 30
        const shuffled = unansweredQuestions.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 30)
      })
    })
}

export function fetchQuestionById(question_id: string): Promise<QuestionType> {
  console.log('Fetching question with ID:', question_id) // Debug log to check the question ID being fetched
  return fetch('/questions/driving_theory_questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }
      return response.json().then((data: unknown) => {
        const questions = QuestionsSchema.parse(data)
        const question = questions.find(q => q.question_id === question_id)
        if (!question) {
          throw new Error('Question not found')
        }
        return question
      })
    })
}

export function fetchAnsweredQuestionsByNumberOfCorrectAnswers(score: number): Promise<QuestionType[]> {
  return fetch('/questions/driving_theory_questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }
      return response.json().then((data: unknown) => {
        const questions = QuestionsSchema.parse(data)
        const answers = getAnswers()

        // Filter questions based on the score of the answers
        const filteredQuestions = questions.filter(question => {
          const answer = answers[question.question_id]
          return answer && answer.score === score
        })

        return filteredQuestions
      })
    })
}

export function getQuestionsCount(): number {
  return 100
}
