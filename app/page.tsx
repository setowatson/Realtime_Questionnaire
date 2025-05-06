import { getSurveyData } from "@/lib/actions"
import { QuestionDisplay } from "@/components/question-display"
import { ClientWrapper } from "@/components/client-wrapper"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { QRCodeDisplay } from "@/components/qr-code"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function Home() {
  // エラーハンドリングを追加
  let surveyData
  try {
    surveyData = await getSurveyData()
  } catch (error) {
    console.error("Failed to fetch survey data:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent>
            <p>アンケートデータの取得中にエラーが発生しました。</p>
            <Button className="mt-4" asChild>
              <Link href="/">再読み込み</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{surveyData.title}</h1>
          <p className="text-gray-600 mt-2">{surveyData.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側2/3: 質問と回答結果 */}
          <div className="lg:col-span-2">
            <ClientWrapper surveyData={surveyData}>
              <ErrorBoundary fallback={<div className="p-4 border rounded bg-red-50">エラーが発生しました。</div>}>
                <Suspense fallback={<div className="text-center p-4">読み込み中...</div>}>
                  <QuestionDisplay questions={surveyData.questions} />
                </Suspense>
              </ErrorBoundary>
            </ClientWrapper>
          </div>

          {/* 右側1/3: QRコードと管理者リンク */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">アンケート参加</CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorBoundary fallback={<div>QRコードの生成に失敗しました</div>}>
                  <QRCodeDisplay />
                </ErrorBoundary>
                <p className="text-center mt-4 text-sm text-gray-500">
                  このQRコードをスキャンして、アンケートに回答してください
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin" className="hidden md:inline-flex">
                    管理者画面へ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
