"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { QuestionResult } from "@/components/question-result"
import type { Question } from "@/lib/types"
import { useSurveyStore } from "@/lib/store"

interface QuestionDisplayProps {
  questions: Question[]
}

export function QuestionDisplay({ questions }: QuestionDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const surveyData = useSurveyStore((state) => state.surveyData)

  if (!questions.length) {
    return <div className="text-center p-8">質問がありません。管理画面で質問を追加してください。</div>
  }

  const currentQuestion = questions[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          前の質問
        </Button>
        <div className="text-sm font-medium">
          質問 {currentIndex + 1} / {questions.length}
        </div>
        <Button variant="outline" onClick={handleNext} disabled={currentIndex === questions.length - 1}>
          次の質問
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          {surveyData && <QuestionResult question={currentQuestion} answers={surveyData.answers} />}
        </CardContent>
      </Card>
    </div>
  )
}
