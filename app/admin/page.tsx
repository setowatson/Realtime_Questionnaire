import { getSurveyData } from "@/lib/actions"
import { AdminQuestionList } from "@/components/admin/question-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminClientWrapper } from "@/components/admin/admin-client-wrapper"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import Link from "next/link"

export default async function AdminPage() {
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
              <Link href="/admin">再読み込み</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto py-4">
        <ErrorBoundary fallback={<div className="p-4 border rounded bg-red-50">エラーが発生しました。</div>}>
          <AdminHeader title={surveyData.title} description={surveyData.description} />
        </ErrorBoundary>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>アンケート質問管理</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminClientWrapper surveyData={surveyData}>
                <ErrorBoundary fallback={<div className="p-4 border rounded bg-red-50">エラーが発生しました。</div>}>
                  <Suspense fallback={<div className="text-center p-4">読み込み中...</div>}>
                    <AdminQuestionList initialQuestions={surveyData.questions} />
                  </Suspense>
                </ErrorBoundary>
              </AdminClientWrapper>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
