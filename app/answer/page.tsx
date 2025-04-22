import { getSurveyData } from "@/lib/actions"
import { AllQuestionsForm } from "@/components/all-questions-form"
import { ClientWrapper } from "@/components/client-wrapper"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AnswerPage() {
  // エラーハンドリングを追加
  let surveyData
  try {
    surveyData = await getSurveyData()
  } catch (error) {
    console.error("Failed to fetch survey data:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent>
            <p>アンケートデータの取得中にエラーが発生しました。</p>
            <Button className="mt-4" asChild>
              <Link href="/answer">再読み込み</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto py-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{surveyData.title}</h1>
          <p className="text-gray-600 mt-2">{surveyData.description}</p>
        </div>

        <ClientWrapper surveyData={surveyData}>
          <ErrorBoundary fallback={<div className="p-4 border rounded bg-red-50">エラーが発生しました。</div>}>
            <Suspense fallback={<div className="text-center p-4">読み込み中...</div>}>
              <AllQuestionsForm questions={surveyData.questions} />
            </Suspense>
          </ErrorBoundary>
        </ClientWrapper>
      </div>
    </main>
  )
}
