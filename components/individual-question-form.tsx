"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import type { Question, Answer } from "@/lib/types"
import { submitAnswer } from "@/lib/actions"
import { useSurveyStore } from "@/lib/store"

interface IndividualQuestionFormProps {
  question: Question
  existingAnswer?: string
}

export function IndividualQuestionForm({ question, existingAnswer }: IndividualQuestionFormProps) {
  const [answer, setAnswer] = useState<string>(existingAnswer || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(!!existingAnswer)
  const addAnswer = useSurveyStore((state) => state.addAnswer)

  const handleSubmit = async () => {
    if (!answer) return

    setIsSubmitting(true)

    try {
      const answerData: Omit<Answer, "timestamp"> = {
        questionId: question.id,
        value: answer,
      }

      // サーバーに送信
      await submitAnswer(answerData)

      // ローカルストアに追加
      const timestamp = Date.now()
      addAnswer({
        ...answerData,
        timestamp,
      })

      setIsSubmitted(true)

      // 送信成功のフィードバックを一時的に表示
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("回答の送信中にエラーが発生しました:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswer(value)
    setIsSubmitted(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.type === "multiple-choice" && <CardDescription>以下の選択肢から選んでください</CardDescription>}
        {question.type === "rating" && <CardDescription>1（低い）から5（高い）で評価してください</CardDescription>}
        {question.type === "text" && <CardDescription>自由にコメントを入力してください</CardDescription>}
      </CardHeader>
      <CardContent>
        {question.type === "multiple-choice" && question.options && (
          <RadioGroup value={answer} onValueChange={handleAnswerChange}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`option-${question.id}-${index}`} />
                <Label htmlFor={`option-${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "text" && (
          <Textarea
            placeholder="ここに回答を入力してください"
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="min-h-[100px]"
          />
        )}

        {question.type === "rating" && (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span>低い</span>
              <span>高い</span>
            </div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={answer === String(rating) ? "default" : "outline"}
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
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          {isSubmitted && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">送信完了</span>
            </div>
          )}
        </div>
        <Button onClick={handleSubmit} disabled={!answer || isSubmitting} className="min-w-24">
          {isSubmitting ? "送信中..." : "送信"}
        </Button>
      </CardFooter>
    </Card>
  )
}
