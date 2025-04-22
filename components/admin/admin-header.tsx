"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateSurveyConfig } from "@/lib/actions"
import Link from "next/link"

interface AdminHeaderProps {
  title: string
  description: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const [surveyTitle, setSurveyTitle] = useState(title)
  const [surveyDescription, setSurveyDescription] = useState(description)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSurveyConfig({
        title: surveyTitle,
        description: surveyDescription,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("設定の保存中にエラーが発生しました:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>アンケート管理画面</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/">アンケート画面へ</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                タイトル
              </label>
              <Input
                id="title"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                説明
              </label>
              <Textarea
                id="description"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                キャンセル
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{surveyTitle}</h2>
              <p className="text-gray-600 mt-1">{surveyDescription}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                編集
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
