"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { Question, Answer } from "@/lib/types"
import { submitAnswer } from "@/lib/actions"
import { useSurveyStore } from "@/lib/store"

interface SurveyFormProps {
  questions: Question[]
}

export function SurveyForm({ questions }: SurveyFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const addAnswer = useSurveyStore((state) => state.addAnswer)

  const currentQuestion = questions[currentQuestionIndex]

  const handleNext = async () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return

    setIsSubmitting(true)

    try {
      const answer: Omit<Answer, "timestamp"> = {
        questionId: currentQuestion.id,
        value: answers[currentQuestion.id],
      }

      // サーバーに送信
      await submitAnswer(answer)

      // ローカルストアに追加
      addAnswer({
        ...answer,
        timestamp: Date.now(),
      })

      // 次の質問へ
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        // 全ての質問が終了
        setIsCompleted(true)
      }
    } catch (error) {
      console.error("回答の送信中にエラーが発生しました:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleReset = () => {
    setAnswers({})
    setIsCompleted(false)
    setCurrentQuestionIndex(0)
  }

  if (!currentQuestion && !isCompleted) {
    return <div>質問がありません</div>
  }

  if (isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>回答ありがとうございました</CardTitle>
          <CardDescription>アンケートへの回答が送信されました。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">ご協力いただきありがとうございます。</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReset} className="w-full">
            もう一度回答する
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          質問 {currentQuestionIndex + 1}/{questions.length}
        </CardTitle>
        <CardDescription>{currentQuestion.text}</CardDescription>
      </CardHeader>
      <CardContent>
        {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
          <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={handleAnswerChange}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQuestion.type === "text" && (
          <Textarea
            placeholder="ここに回答を入力してください"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="min-h-[100px]"
          />
        )}

        {currentQuestion.type === "rating" && (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span>低い</span>
              <span>高い</span>
            </div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={answers[currentQuestion.id] === String(rating) ? "default" : "outline"}
                  onClick={() => handleAnswerChange(String(rating))}
                  className="w-12 h-12 rounded-full"
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={!answers[currentQuestion.id] || isSubmitting} className="w-full">
          {isSubmitting ? "送信中..." : currentQuestionIndex < questions.length - 1 ? "次へ" : "送信"}
        </Button>
      </CardFooter>
    </Card>
  )
}
