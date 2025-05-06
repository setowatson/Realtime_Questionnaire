"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { QuestionEditor } from "@/components/admin/question-editor"
import type { Question } from "@/lib/types"
import { updateSurveyConfig } from "@/lib/actions"
import { useSurveyStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

interface AdminQuestionListProps {
  initialQuestions: Question[]
}

export function AdminQuestionList({ initialQuestions }: AdminQuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const surveyData = useSurveyStore((state) => state.surveyData)

  const handleSaveQuestions = async (updatedQuestions: Question[]) => {
    setIsSaving(true)
    try {
      await updateSurveyConfig({
        questions: updatedQuestions,
      })
      setQuestions(updatedQuestions)
    } catch (error) {
      console.error("質問の保存中にエラーが発生しました:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddQuestion = (question: Question) => {
    const updatedQuestions = [...questions, question]
    handleSaveQuestions(updatedQuestions)
    setIsCreating(false)
  }

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    const updatedQuestions = questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    handleSaveQuestions(updatedQuestions)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("この質問を削除してもよろしいですか？")) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId)
      handleSaveQuestions(updatedQuestions)
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "選択式"
      case "text":
        return "テキスト"
      case "rating":
        return "評価"
      default:
        return type
    }
  }

  const getResponseCount = (questionId: string) => {
    if (!surveyData) return 0
    return surveyData.answers.filter((a) => a.questionId === questionId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">質問一覧</h3>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingQuestion}>
          <PlusCircle className="mr-2 h-4 w-4" />
          質問を追加
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardContent className="pt-6">
            <QuestionEditor onSave={handleAddQuestion} onCancel={() => setIsCreating(false)} />
          </CardContent>
        </Card>
      )}

      {questions.length === 0 && !isCreating ? (
        <div className="text-center py-8 text-gray-500">
          質問がありません。「質問を追加」ボタンをクリックして質問を作成してください。
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="relative">
              {editingQuestion?.id === question.id ? (
                <CardContent className="pt-6">
                  <QuestionEditor
                    question={question}
                    onSave={handleUpdateQuestion}
                    onCancel={() => setEditingQuestion(null)}
                  />
                </CardContent>
              ) : (
                <CardContent className="flex justify-between items-start p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Q{index + 1}:</span>
                      <span>{question.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getQuestionTypeLabel(question.type)}</Badge>
                      <span className="text-sm text-gray-500">回答数: {getResponseCount(question.id)}</span>
                    </div>
                    {question.type === "multiple-choice" && question.options && (
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">選択肢:</span> {question.options.join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingQuestion(question)}
                      disabled={!!editingQuestion || isCreating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuestion(question.id)}
                      disabled={!!editingQuestion || isCreating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
