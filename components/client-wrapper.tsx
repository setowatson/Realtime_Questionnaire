"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { SurveyData } from "@/lib/types"
import { useSurveyStore } from "@/lib/store"
import { getSurveyData } from "@/lib/actions"
import { usePolling } from "@/hooks/use-polling"

interface ClientWrapperProps {
  surveyData: SurveyData
  children: React.ReactNode
}

export function ClientWrapper({ surveyData: initialSurveyData, children }: ClientWrapperProps) {
  const setSurveyData = useSurveyStore((state) => state.setSurveyData)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初期データをストアに設定
  useEffect(() => {
    if (initialSurveyData && !isInitialized) {
      try {
        setSurveyData(initialSurveyData)
        setIsInitialized(true)
      } catch (error) {
        console.error("Error setting initial survey data in store:", error)
      }
    }
  }, [initialSurveyData, setSurveyData, isInitialized])

  // ポーリングでデータを定期的に更新
  const { error } = usePolling(
    async () => {
      try {
        const latestData = await getSurveyData()
        setSurveyData(latestData)
        return latestData
      } catch (error) {
        console.error("Error fetching survey data:", error)
        throw error
      }
    },
    {
      interval: 2000, // 2秒ごとに更新
      enabled: isInitialized, // 初期化後にポーリングを開始
      onError: (error) => {
        console.error("Polling error:", error)
      },
    },
  )

  if (error) {
    return <div className="text-center p-4 text-red-500">データの更新中にエラーが発生しました。</div>
  }

  if (!isInitialized) {
    return <div className="text-center p-4">データを読み込み中...</div>
  }

  return <>{children}</>
}
