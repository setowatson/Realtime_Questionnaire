import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">リアルタイムアンケートシステム</h1>
        <p className="text-xl mb-8">
          会議やプレゼンテーション中に、参加者からリアルタイムでフィードバックを集めましょう
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" className="w-full">
              アンケートを作成
            </Button>
          </Link>
          <Link href="/surveys">
            <Button size="lg" variant="outline" className="w-full">
              既存のアンケート
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
