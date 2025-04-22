"use client"

import { useEffect, useRef, useState } from "react"

interface UsePollingOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {},
): { data: T | null; isLoading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const { interval = 3000, enabled = true, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await fetchFn()
      setData(result)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(fetchData, interval)
  }

  const stopPolling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData()
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, interval])

  const refetch = async () => {
    await fetchData()
  }

  return { data, isLoading, error, refetch }
}
