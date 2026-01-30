import { useRef, useCallback } from 'react'

interface PollingOptions {
  initialInterval?: number
  maxInterval?: number
  backoffMultiplier?: number
  maxAttempts?: number
}

export function usePolling() {
  const timeoutRef = useRef<number | null>(null)
  const attemptRef = useRef(0)

  const stopPolling = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    attemptRef.current = 0
  }, [])

  const startPolling = useCallback(
    <T>(
      pollFn: () => Promise<T>,
      shouldContinue: (result: T) => boolean,
      onResult: (result: T) => void,
      onError: (error: Error) => void,
      options: PollingOptions = {}
    ) => {
      const {
        initialInterval = 2000,
        maxInterval = 10000,
        backoffMultiplier = 1.5,
        maxAttempts = 180,
      } = options

      attemptRef.current = 0

      const poll = async () => {
        if (attemptRef.current >= maxAttempts) {
          onError(new Error('Maximum polling attempts reached'))
          return
        }

        try {
          const result = await pollFn()
          onResult(result)

          if (shouldContinue(result)) {
            attemptRef.current++
            const interval = Math.min(
              initialInterval * Math.pow(backoffMultiplier, attemptRef.current),
              maxInterval
            )
            timeoutRef.current = window.setTimeout(poll, interval)
          }
        } catch (error) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }

      poll()
    },
    []
  )

  return { startPolling, stopPolling }
}
