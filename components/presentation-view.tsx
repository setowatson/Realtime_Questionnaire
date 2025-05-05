"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getSurveyResponses } from "@/app/actions"
import QRCode from "react-qr-code"
import { usePathname } from "next/navigation"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function PresentationView({ survey }: { survey: any }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const pathname = usePathname()

  const currentQuestion = survey.questions[currentQuestionIndex]
  const responseUrl = `${window.location.origin}/respond/${survey.id}`

  useEffect(() => {
    // 初回のレスポンスを取得
    fetchResponses()

    // 定期的に更新
    const interval = setInterval(fetchResponses, 2000)
    return () => clearInterval(interval)
  }, [survey.id])

  async function fetchResponses() {
    const data = await getSurveyResponses(survey.id)
    setResponses(data)
  }

  function getResultsForCurrentQuestion() {
    const results = new Array(currentQuestion.options.length).fill(0)

    responses.forEach((response) => {
      const answer = response.answers[currentQuestionIndex]
      if (answer !== undefined) {
        results[answer]++
      }
    })

    return results
  }

  const chartData = {
    labels: currentQuestion.options,
    datasets: [
      {
        label: "回答数",
        data: getResultsForCurrentQuestion(),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 左側: アンケート情報とQRコード */}
      <div className="w-full md:w-1/2 p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          {survey.description && <p className="mt-2 text-gray-600">{survey.description}</p>}
        </div>

        <Card className="mb-6 flex-grow">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              質問 {currentQuestionIndex + 1}/{survey.questions.length}
            </h2>
            <p className="text-xl mb-6">{currentQuestion.text}</p>

            <div className="space-y-2">
              {currentQuestion.options.map((option: string, index: number) => (
                <div key={index} className="p-3 border rounded-md">
                  {option}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <p className="mb-2 text-center">このQRコードをスキャンして回答</p>
            <div className="bg-white p-2 rounded-md">
              <QRCode value={responseUrl} size={150} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              前の質問
            </button>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(survey.questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === survey.questions.length - 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              次の質問
            </button>
          </div>
        </div>
      </div>

      {/* 右側: リアルタイム結果 */}
      <div className="w-full md:w-1/2 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">リアルタイム結果</h2>
          <p className="text-gray-600">回答者数: {responses.length}</p>
        </div>

        <div className="h-[500px]">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">回答の内訳</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option: string, index: number) => {
              const count = getResultsForCurrentQuestion()[index]
              const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0

              return (
                <div key={index} className="flex justify-between items-center">
                  <span>{option}</span>
                  <span className="font-semibold">
                    {count}票 ({percentage}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
