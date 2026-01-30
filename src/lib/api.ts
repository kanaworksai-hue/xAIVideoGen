import type { VideoGenerationRequest, VideoEditRequest, VideoGenerationResponse, VideoStatusResponse } from '../types'

const API_BASE_URL = 'https://api.x.ai/v1'

export async function startVideoGeneration(
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  console.log('Starting video generation with:', request)

  const response = await fetch(`${API_BASE_URL}/videos/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  })

  const data = await response.json().catch(() => ({}))
  console.log('Generation response:', response.status, data)

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `API error: ${response.status}`)
  }

  return data
}

export async function editVideo(
  apiKey: string,
  request: VideoEditRequest
): Promise<VideoGenerationResponse> {
  console.log('Starting video edit with:', request)

  const response = await fetch(`${API_BASE_URL}/videos/edits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  })

  const data = await response.json().catch(() => ({}))
  console.log('Edit response:', response.status, data)

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `API error: ${response.status}`)
  }

  return data
}

export async function checkVideoStatus(
  apiKey: string,
  requestId: string
): Promise<VideoStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/videos/${requestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  const data = await response.json().catch(() => ({}))
  console.log('Status check response:', response.status, data)

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `API error: ${response.status}`)
  }

  return data
}
