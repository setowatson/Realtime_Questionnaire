"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitResponse } from "@/app/actions"

export default function ResponseForm({ survey }: { survey: any }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleSubmit = async () => {
    try {
      await submitResponse(survey.id, answers)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting response:", error)
      alert("回答の送信中にエラーが発生しました")
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>回答を送信しました</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ご協力ありがとうございました！</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {survey.questions.map((question: any, qIndex: number) => (
        <Card key={qIndex}>
          <CardHeader>
            <CardTitle>
              質問 {qIndex + 1}: {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[qIndex]?.toString()}
              onValueChange={(value) => handleSelectOption(qIndex, Number.parseInt(value))}
            >
              {question.options.map((option: string, oIndex: number) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                  <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== survey.questions.length}
        className="w-full"
      >
        回答を送信
      </Button>
    </div>
  )
}
