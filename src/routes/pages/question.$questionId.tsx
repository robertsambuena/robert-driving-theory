import { fetchQuestionById, type QuestionType } from '@/lib/fetchQuestions'
import { createFileRoute } from '@tanstack/react-router'

import { QuestionView } from '../../components/question/QuestionView'

export const Route = createFileRoute('/pages/question/$questionId')({
  component: RouteComponent,
  loader: ({ params }) => fetchQuestionById(params.questionId),
})

function RouteComponent() {
  const question: QuestionType = Route.useLoaderData() // This will trigger the loader to fetch questions when the route is accessed

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold my-4">Question #{question.question_id}</h1>
      <QuestionView question={question}/>
    </div>
  )
}
