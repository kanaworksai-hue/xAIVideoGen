import { useState, useCallback, useRef, useEffect } from 'react'
import { startVideoGeneration, checkVideoStatus } from '../lib/api'
import { usePolling } from './usePolling'
import type { AspectRatio, Resolution, GenerationState, VideoStatusResponse } from '../types'

interface GenerationParams {
  prompt: string
  imageUrl?: string
  duration: number
  aspectRatio: AspectRatio
  resolution: Resolution
}

export function useVideoGeneration(apiKey: string) {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    requestId: null,
    status: null,
    videoUrl: null,
    error: null,
    elapsedTime: 0,
    debugInfo: null,
  })

  const { startPolling, stopPolling } = usePolling()
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - startTimeRef.current!) / 1000),
        }))
      }
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    startTimeRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      stopTimer()
      stopPolling()
    }
  }, [stopTimer, stopPolling])

  const generate = useCallback(
    async (params: GenerationParams) => {
      if (!apiKey) {
        setState(prev => ({ ...prev, error: 'API key is required' }))
        return
      }

      if (!params.prompt.trim()) {
        setState(prev => ({ ...prev, error: 'Prompt is required' }))
        return
      }

      setState({
        isGenerating: true,
        requestId: null,
        status: 'pending',
        videoUrl: null,
        error: null,
        elapsedTime: 0,
        debugInfo: null,
      })

      startTimer()

      try {
        const request = {
          prompt: params.prompt,
          model: 'grok-imagine-video' as const,
          ...(params.imageUrl && { image: { url: params.imageUrl } }),
          duration: params.duration,
          aspect_ratio: params.aspectRatio,
          resolution: params.resolution,
        }

        const response = await startVideoGeneration(apiKey, request)
        const requestId = response.request_id

        setState(prev => ({
          ...prev,
          requestId,
          status: 'processing',
        }))

        startPolling<VideoStatusResponse>(
          () => checkVideoStatus(apiKey, requestId),
          (result) => {
            // Continue polling if no url yet and no error
            // API may return url at root level OR video.url
            console.log('Poll result:', result)
            const videoUrl = result.url || result.video?.url
            return !videoUrl && !result.error
          },
          (result) => {
            console.log('Processing result:', result)

            // Store debug info - show last API response
            const debugStr = JSON.stringify(result, null, 2)

            // Check if video is ready - check both url formats
            const videoUrl = result.url || result.video?.url
            if (videoUrl) {
              stopTimer()
              setState(prev => ({
                ...prev,
                isGenerating: false,
                status: 'completed',
                videoUrl: videoUrl,
                debugInfo: debugStr,
              }))
            } else if (result.error || result.status === 'failed') {
              // Handle error
              stopTimer()
              setState(prev => ({
                ...prev,
                isGenerating: false,
                status: 'failed',
                error: result.error || result.message || 'Video generation failed',
                debugInfo: debugStr,
              }))
            } else {
              // Still processing - update status if available
              const status = result.status || result.state
              setState(prev => ({
                ...prev,
                status: status === 'queued' ? 'pending' : 'processing',
                debugInfo: debugStr,
              }))
            }
          },
          (error) => {
            console.error('Polling error:', error)
            stopTimer()
            setState(prev => ({
              ...prev,
              isGenerating: false,
              status: 'failed',
              error: error.message,
            }))
          }
        )
      } catch (error) {
        stopTimer()
        setState(prev => ({
          ...prev,
          isGenerating: false,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Failed to start generation',
        }))
      }
    },
    [apiKey, startPolling, startTimer, stopTimer]
  )

  const reset = useCallback(() => {
    stopTimer()
    stopPolling()
    setState({
      isGenerating: false,
      requestId: null,
      status: null,
      videoUrl: null,
      error: null,
      elapsedTime: 0,
      debugInfo: null,
    })
  }, [stopTimer, stopPolling])

  return { ...state, generate, reset }
}
