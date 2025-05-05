"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"
import { createSurvey } from "@/app/actions"

export default function CreateSurvey() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([{ text: "", options: ["", ""] }])

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""] }])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].text = text
    setQuestions(newQuestions)
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push("")
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = text
    setQuestions(newQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.splice(optionIndex, 1)
    setQuestions(newQuestions)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("タイトルを入力してください")
      return
    }

    if (questions.some((q) => !q.text.trim() || q.options.some((o) => !o.trim()))) {
      alert("すべての質問とオプションを入力してください")
      return
    }

    try {
      const surveyId = await createSurvey({
        title,
        description,
        questions,
      })

      router.push(`/present/${surveyId}`)
    } catch (error) {
      console.error("Error creating survey:", error)
      alert("アンケートの作成中にエラーが発生しました")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">新しいアンケートを作成</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>アンケート情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="アンケートのタイトル"
            />
          </div>
          <div>
            <Label htmlFor="description">説明（任意）</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="アンケートの説明"
            />
          </div>
        </CardContent>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={qIndex} className="mb-6">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex-1">質問 {qIndex + 1}</CardTitle>
            {questions.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`question-${qIndex}`}>質問文</Label>
              <Input
                id={`question-${qIndex}`}
                value={question.text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                placeholder="質問を入力してください"
              />
            </div>
            <div className="space-y-2">
              <Label>選択肢</Label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`選択肢 ${oIndex + 1}`}
                  />
                  {question.options.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeOption(qIndex, oIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addOption(qIndex)} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" />
                選択肢を追加
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col gap-4 mb-8">
        <Button variant="outline" onClick={addQuestion}>
          <PlusCircle className="h-5 w-5 mr-2" />
          質問を追加
        </Button>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit}>アンケートを作成</Button>
      </div>
    </div>
  )
}
