"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resetSurvey } from "@/lib/actions"
import { useState } from "react"

export function AdminControls() {
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    if (confirm("本当にすべての回答をリセットしますか？")) {
      setIsResetting(true)
      try {
        await resetSurvey()
        window.location.reload() // 画面をリロードして最新の状態を取得
      } catch (error) {
        console.error("リセット中にエラーが発生しました:", error)
      } finally {
        setIsResetting(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理者コントロール</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={handleReset} disabled={isResetting} className="w-full">
          {isResetting ? "リセット中..." : "回答をリセット"}
        </Button>
      </CardContent>
    </Card>
  )
}
