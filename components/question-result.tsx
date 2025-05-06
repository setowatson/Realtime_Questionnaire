"use client"

import { useEffect, useState, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Question, Answer } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface QuestionResultProps {
  question: Question
  answers: Answer[]
}

export function QuestionResult({ question, answers }: QuestionResultProps) {
  const [hasNewAnswer, setHasNewAnswer] = useState(false)
  const prevAnswersRef = useRef<Answer[]>([])
  const questionAnswers = answers.filter((a) => a.questionId === question.id)

  // 新しい回答があった場合のアニメーション効果
  useEffect(() => {
    const prevCount = prevAnswersRef.current.length
    const currentCount = questionAnswers.length

    if (prevCount > 0 && currentCount > prevCount) {
      setHasNewAnswer(true)
      const timer = setTimeout(() => {
        setHasNewAnswer(false)
      }, 2000)
      return () => clearTimeout(timer)
    }

    prevAnswersRef.current = [...questionAnswers]
  }, [questionAnswers])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const getQuestionResults = () => {
    if (question.type === "multiple-choice" && question.options) {
      const counts = question.options.reduce<Record<string, number>>((acc, option) => {
        acc[option] = 0
        return acc
      }, {})

      questionAnswers.forEach((answer) => {
        if (counts[answer.value] !== undefined) {
          counts[answer.value]++
        }
      })

      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }

    if (question.type === "rating") {
      const counts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      }

      questionAnswers.forEach((answer) => {
        if (counts[answer.value as keyof typeof counts] !== undefined) {
          counts[answer.value as keyof typeof counts]++
        }
      })

      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }

    return []
  }

  const getTextResponses = () => {
    return questionAnswers.map((a) => a.value)
  }

  return (
    <div className={`space-y-4 transition-all duration-500 ${hasNewAnswer ? "bg-green-50 rounded-md p-2" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">回答結果</h3>
        <Badge variant={hasNewAnswer ? "default" : "outline"} className="transition-all duration-300">
          回答数: {questionAnswers.length}
        </Badge>
      </div>

      {(question.type === "multiple-choice" || question.type === "rating") && (
        <div className="h-[250px]">
          {question.type === "multiple-choice" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getQuestionResults()}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getQuestionResults()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={500}
                >
                  {getQuestionResults().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {question.type === "text" && (
        <div className="max-h-[250px] overflow-y-auto space-y-2">
          {getTextResponses().length > 0 ? (
            getTextResponses().map((response, index) => (
              <div
                key={index}
                className={`p-3 bg-gray-100 rounded-md ${
                  index === getTextResponses().length - 1 && hasNewAnswer ? "border-l-4 border-green-500" : ""
                }`}
              >
                {response}
              </div>
            ))
          ) : (
            <p className="text-gray-500">まだ回答はありません</p>
          )}
        </div>
      )}
    </div>
  )
}
