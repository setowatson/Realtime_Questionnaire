import { getAllSurveys } from "@/app/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SurveysPage() {
  const surveys = await getAllSurveys()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">アンケート一覧</h1>
        <Link href="/create">
          <Button>新規作成</Button>
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">アンケートがまだありません</p>
          <Link href="/create">
            <Button>最初のアンケートを作成</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey: any) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">{survey.description || "説明なし"}</p>
                <p className="text-sm text-gray-500 mt-2">質問数: {survey.questions.length}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/respond/${survey.id}`}>
                  <Button variant="outline" size="sm">
                    回答
                  </Button>
                </Link>
                <Link href={`/present/${survey.id}`}>
                  <Button size="sm">プレゼン</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
