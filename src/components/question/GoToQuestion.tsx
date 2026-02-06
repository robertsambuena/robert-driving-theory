import { Link } from "@tanstack/react-router";
import { Input } from "../base/input/input";
import { useState } from "react";

export function GoToQuestion() {
  const [questionId, setQuestionId] = useState("")
  
  return (
    <div className="flex gap-4 mt-8 w-full max-w-md justify-center items-center">
      <Input placeholder="Go to question..." className="w-full max-w-md" id="questionId" value={questionId} onChange={e => setQuestionId(e)} />
      <Link to={`/pages/question/${questionId}` as any}>
        <div className="hover:underline cursor-pointer text-utility-brand-600 h-10 w-32 border border-utility-brand-600 rounded flex items-center justify-center max-w-full">Go</div>
      </Link>
    </div>
  )
}
