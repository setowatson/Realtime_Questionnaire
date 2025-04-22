"use client"

import { QRCodeSVG } from "qrcode.react"
import { useState, useEffect } from "react"

export function QRCodeDisplay() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // クライアントサイドでのみURLを取得
      const baseUrl = window.location.origin
      const answerUrl = `${baseUrl}/answer`
      setUrl(answerUrl)
    } catch (err) {
      console.error("Error generating QR code URL:", err)
      setError("QRコードの生成に失敗しました")
    }
  }, [])

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!url) {
    return <div className="text-center">QRコードを生成中...</div>
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG value={url} size={180} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} includeMargin={false} />
      </div>
    </div>
  )
}
