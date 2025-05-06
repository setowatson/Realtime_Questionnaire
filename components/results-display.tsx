"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Question, SurveyData } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSurveyStore } from "@/lib/store"

// ResultsDisplayPropsインターフェースを更新
interface ResultsDisplayProps {
  surveyData: SurveyData
}

// コンポーネントの冒頭に以下を追加（既存のコードの前に）
export function ResultsDisplay({ surveyData: initialSurveyData }: ResultsDisplayProps) {
  const surveyStoreData = useSurveyStore((state) => state.surveyData)
  const [surveyData, setSurveyData] = useState(initialSurveyData)

  // リアルタイム更新のためにストアからデータを取得
  useEffect(() => {
    if (surveyStoreData) {
      setSurveyData(surveyStoreData)
    }
  }, [surveyStoreData])

  const { questions, answers } = surveyData

  const getQuestionResults = (question: Question) => {
    const questionAnswers = answers.filter((a) => a.questionId === question.id)

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

  const getTextResponses = (question: Question) => {
    return answers.filter((a) => a.questionId === question.id).map((a) => a.value)
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">リアルタイム結果</h2>

      {questions.map((question) => (
        <Card key={question.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            {(question.type === "multiple-choice" || question.type === "rating") && (
              <div className="h-[300px]">
                {question.type === "multiple-choice" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getQuestionResults(question)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getQuestionResults(question)}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getQuestionResults(question).map((entry, index) => (
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
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {getTextResponses(question).length > 0 ? (
                  getTextResponses(question).map((response, index) => (
                    <div key={index} className="p-3 bg-gray-100 rounded-md">
                      {response}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">まだ回答はありません</p>
                )}
              </div>
            )}

            <div className="mt-2 text-sm text-gray-500">
              回答数: {answers.filter((a) => a.questionId === question.id).length}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
