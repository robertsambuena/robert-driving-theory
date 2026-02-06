import { fetch30RandomUnansweredQuestions } from '@/lib/fetchQuestions'
import { createFileRoute, Link } from '@tanstack/react-router'
import { QuestionView } from '../../components/question/QuestionView'
import { Button } from '@/components/base/buttons/button'
import { useState } from 'react'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { ArrowLeft } from '@untitledui/icons'

export const Route = createFileRoute('/pages/30questions')({
  component: RouteComponent,
  loader: () => fetch30RandomUnansweredQuestions(),
})

function RouteComponent() {
  const questions = Route.useLoaderData() // This will trigger the loader to fetch questions when the route is accessed

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  if (questions.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        <h1 className="text-2xl font-bold my-4">No more questions available</h1>
      </div>
    )
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline cursor-pointer text-utility-brand-600">
          <FeaturedIcon color="warning" icon={ArrowLeft} theme="light" size="md" />
        </Link>
        <h1 className="text-2xl font-bold my-4">30 Random Unanswered Questions</h1>
      </div>
      <QuestionView question={questions[currentQuestionIndex]} ordinal={currentQuestionIndex + 1}/>

      {/* Style these buttons in a way that if the viewport is in mobile, the buttons should be fixed below the screen,
      And in desktop, they should be the same as right now */}
      <div className="flex gap-4 mt-4 w-full justify-center fixed bottom-0 left-0 right-0 bg-gray-100 p-4 md:relative md:bg-transparent md:p-0">
        <Button onClick={handlePrev} isDisabled={currentQuestionIndex === 0}>Prev</Button>
        <Button onClick={handleNext} isDisabled={currentQuestionIndex === questions.length - 1}>Next</Button>
      </div>
    </div>
  )
}
