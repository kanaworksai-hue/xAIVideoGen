export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16' | '3:4' | '3:2' | '2:3'

export type Resolution = '720p' | '480p'

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface VideoGenerationRequest {
  prompt: string
  model: 'grok-imagine-video'
  image?: { url: string }
  duration?: number
  aspect_ratio?: AspectRatio
  resolution?: Resolution
}

export interface VideoEditRequest {
  prompt: string
  model: 'grok-imagine-video'
  video: { url: string }
}

export interface VideoGenerationResponse {
  request_id: string
}

// API response format varies:
// - Edit endpoint returns: { url: string } directly (per official docs)
// - Generation may return: { video: { url: string, duration: number } }
export interface VideoStatusResponse {
  url?: string  // Direct URL (edit endpoint per docs)
  video?: {
    url?: string
    duration?: number
    respect_moderation?: boolean
  }
  model?: string
  status?: string
  state?: string
  error?: string
  message?: string
}

export interface GenerationState {
  isGenerating: boolean
  requestId: string | null
  status: VideoStatus | null
  videoUrl: string | null
  error: string | null
  elapsedTime: number
  debugInfo: string | null
}
