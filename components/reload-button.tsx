"use client"

import { Button } from "@/components/ui/button"

interface ReloadButtonProps {
  label?: string
}

export function ReloadButton({ label = "再読み込み" }: ReloadButtonProps) {
  return <Button onClick={() => window.location.reload()}>{label}</Button>
}
