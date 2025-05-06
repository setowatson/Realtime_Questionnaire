"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, X } from "lucide-react"
import type { Question, QuestionType } from "@/lib/types"

interface QuestionEditorProps {
  question?: Question
  onSave: (question: Question) => void
  onCancel: () => void
}

export function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(question?.text || "")
  const [questionType, setQuestionType] = useState<QuestionType>(question?.type || "multiple-choice")
  const [options, setOptions] = useState<string[]>(question?.options || [""])
  const [newOption, setNewOption] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!questionText.trim()) {
      newErrors.text = "質問文を入力してください"
    }

    if (questionType === "multiple-choice") {
      if (options.length < 2) {
        newErrors.options = "少なくとも2つの選択肢が必要です"
      } else if (options.some((option) => !option.trim())) {
        newErrors.options = "空の選択肢があります"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const newQuestion: Question = {
      id: question?.id || `q${Date.now()}`,
      text: questionText,
      type: questionType,
      ...(questionType === "multiple-choice" && { options }),
    }

    onSave(newQuestion)
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()])
      setNewOption("")
    }
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleTypeChange = (value: string) => {
    setQuestionType(value as QuestionType)
    if (value === "multiple-choice" && options.length === 0) {
      setOptions([""])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question-text" className="block text-sm font-medium mb-1">
          質問文
        </Label>
        <Input
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="質問文を入力してください"
          className="w-full"
        />
        {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
      </div>

      <div>
        <Label htmlFor="question-type" className="block text-sm font-medium mb-1">
          質問タイプ
        </Label>
        <Select value={questionType} onValueChange={handleTypeChange}>
          <SelectTrigger id="question-type">
            <SelectValue placeholder="質問タイプを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple-choice">選択式</SelectItem>
            <SelectItem value="text">テキスト入力</SelectItem>
            <SelectItem value="rating">評価（1-5）</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questionType === "multiple-choice" && (
        <div>
          <Label className="block text-sm font-medium mb-1">選択肢</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...options]
                  newOptions[index] = e.target.value
                  setOptions(newOptions)
                }}
                placeholder={`選択肢 ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="新しい選択肢"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddOption()
                }
              }}
            />
            <Button variant="outline" onClick={handleAddOption} disabled={!newOption.trim()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              追加
            </Button>
          </div>
          {errors.options && <p className="text-red-500 text-sm mt-1">{errors.options}</p>}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  )
}
