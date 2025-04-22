"use client"

import { useState, useEffect } from "react"
import { IndividualQuestionForm } from "@/components/individual-question-form"
import type { Question } from "@/lib/types"
import { useSurveyStore } from "@/lib/store"

interface AllQuestionsFormProps {
  questions: Question[]
}

export function AllQuestionsForm({ questions }: AllQuestionsFormProps) {
  const surveyData = useSurveyStore((state) => state.surveyData)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})

  // 既存の回答があれば取得
  useEffect(() => {
    if (surveyData) {
      const answers: Record<string, string> = {}
      surveyData.answers.forEach((answer) => {
        answers[answer.questionId] = answer.value
      })
      setUserAnswers(answers)
    }
  }, [surveyData])

  if (!questions.length) {
    return <div className="text-center p-8">質問がありません。</div>
  }

  return (
    <div className="space-y-8">
      <p className="text-center text-gray-600">
        各質問に回答して「送信」ボタンをクリックしてください。回答はリアルタイムで反映されます。
      </p>

      {questions.map((question) => (
        <IndividualQuestionForm key={question.id} question={question} existingAnswer={userAnswers[question.id]} />
      ))}
    </div>
  )
}
