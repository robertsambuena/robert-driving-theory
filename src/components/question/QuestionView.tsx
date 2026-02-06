import type { QuestionType } from "@/lib/fetchQuestions"
import { Checkbox } from "../base/checkbox/checkbox"
import { Button } from "../base/buttons/button"
import { getAnswerByQuestionId, saveAnswer } from "@/lib/answers"
import { useEffect, useMemo, useState } from "react"
import { CheckCircle, XCircle } from "@untitledui/icons"
import { FeaturedIcon } from "../foundations/featured-icon/featured-icon"
import { Input } from "../base/input/input"

type QuestionViewProps = {
  question: QuestionType
  ordinal?: number
}

export function QuestionView({question, ordinal}: QuestionViewProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")

  const answerType: 'multiple' | 'number' = question.options.length > 1 ? 'multiple' : 'number'
  
  const hasCurrentAnswer = useMemo(() => {
    return answerType === 'multiple' ? selectedOptions.length > 0 : textAnswer.trim().length > 0
  }, [selectedOptions, answerType, textAnswer])

  useEffect(() => {
    setIsCorrect(null)
    setSelectedOptions([])
    setIsSubmitted(false)
  }, [question])

  const handleOptionChange = (optionLetter: string, isChecked: boolean) => {
    setSelectedOptions(prevSelectedOptions => {
      if (isChecked) {
        return [...prevSelectedOptions, optionLetter]
      } else {
        return prevSelectedOptions.filter(letter => letter !== optionLetter)
      }
    })
  }

  const handleSubmit = () => {
    const correctOptionLetters = question.correct_answers.map(answer => answer.letter)
    const isCorrectAnswer = answerType === 'multiple'
      ? selectedOptions.length === correctOptionLetters.length && selectedOptions.every(letter => correctOptionLetters.includes(letter))
      : textAnswer.trim() === correctOptionLetters[0]
    setIsCorrect(isCorrectAnswer)

    const answerRecord = getAnswerByQuestionId(question.question_id)
    const previousScore = answerRecord?.score
    // If correct, +1 score, if wrong, -1 score. If the question was previously answered, we need to adjust the score based on the previous answer. For example, if the user previously got it wrong (-1) and now gets it right (+1), we should add 2 points to the score to reflect the improvement. Conversely, if they previously got it right (+1) and now get it wrong (-1), we should subtract 2 points from the score to reflect the decline.
    const newScore = isCorrectAnswer ? 1 : -1
    const adjustedScore = previousScore !== undefined ? newScore - previousScore : newScore

    saveAnswer(question.question_id, adjustedScore)
    setIsSubmitted(true)
  }

  const correctIcon = (
    <FeaturedIcon color="success" icon={CheckCircle} theme="light" size="md" />
  )

  const wrongIcon = (
    <FeaturedIcon color="error" icon={XCircle} theme="light" size="md" />
  )

  const answerBox = useMemo(() => {
    if (answerType === 'multiple') {
      return question.options.map(option => (
        <div key={option.letter} className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-100 border border-gray-300 before:absolute before:inset-0 before:rounded before:bg-gray-200 before:opacity-0 before:transition-opacity before:pointer-events-none hover:before:opacity-50 relative"
          >
            <Checkbox
              id={`${question.question_id}-${option.letter}`}
              size="md"
              label={(
                <><strong>{option.letter}</strong> {option.text}</>
              )}
              isSelected={selectedOptions.includes(option.letter)}
              onChange={(isChecked) => handleOptionChange(option.letter, isChecked)}
              isDisabled={isSubmitted}
            />
          </div>
          {isCorrect === true && question.correct_answers.some(answer => answer.letter === option.letter) && correctIcon}
          {isCorrect === false && question.correct_answers.some(answer => answer.letter === option.letter) && correctIcon}
          {isCorrect === false && !question.correct_answers.some(answer => answer.letter === option.letter) && selectedOptions.includes(option.letter) && wrongIcon}
        </div>
      ))
    }

    if (answerType === 'number') {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center px-2 py-1 gap-2">
            <Input isRequired placeholder="Answer:" value={textAnswer} onChange={value => setTextAnswer(value)} />
            {isCorrect === true && correctIcon}
            {isCorrect === false && wrongIcon}
          </div>
        </div>
      )
    }
  }, [question.options, selectedOptions, isSubmitted, isCorrect, answerType, textAnswer])

  const questionMedia = useMemo(() => {
    if (question.video_urls.length > 0) {
      return <div>{question.video_urls.map(url => <video key={url} src={url} controls autoPlay={true} />)}</div>
    }

    return <div>{question.image_urls.map(url => <img key={url} src={url} alt="Question related" />)}</div>
  }, [question.video_urls, question.image_urls])

  return (
    <div className="max-w-2xl w-full bg-white p-4 rounded shadow gap-4 flex flex-col" style={{height: '700px', overflowY: 'auto'}}>
      <div className="w-full flex flex-col items-start">
        {questionMedia}
      </div>
      <div className="w-full flex flex-col items-start gap-2">
        <div className="text-lg font-semibold">{ordinal ? `${ordinal}. ` : ' '}{question.question_text}</div>

        <div className="flex flex-col items-start gap-2">
          {answerBox}
        </div>

        {isCorrect === true && <div className="text-green-600 font-bold">Correct!</div>}
        {isCorrect === false && (
          <div className="text-red-600 font-bold">
            Wrong!
            <div className="text-sm text-gray-600">{question.comment}</div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center">
        <Button onClick={handleSubmit} isDisabled={isSubmitted || !hasCurrentAnswer}>Submit</Button>
      </div>
    </div>
  )
}
