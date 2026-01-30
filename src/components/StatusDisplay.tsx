import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import type { VideoStatus } from '../types'

interface StatusDisplayProps {
  status: VideoStatus | null
  error: string | null
  elapsedTime: number
  requestId?: string | null
  debugInfo?: string | null
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function StatusDisplay({ status, error, elapsedTime, requestId, debugInfo }: StatusDisplayProps) {
  if (!status && !error) return null

  return (
    <div className="space-y-2">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          {status === 'pending' && (
            <>
              <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
              <div className="flex-1">
                <p className="font-medium">Queued</p>
                <p className="text-sm text-muted-foreground">Waiting to start...</p>
              </div>
            </>
          )}
          {status === 'processing' && (
            <>
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <div className="flex-1">
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">Generating your video...</p>
              </div>
            </>
          )}
          {status === 'completed' && (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Complete</p>
                <p className="text-sm text-muted-foreground">Your video is ready!</p>
              </div>
            </>
          )}
          {status === 'failed' && (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Failed</p>
                <p className="text-sm text-muted-foreground">{error || 'An error occurred'}</p>
              </div>
            </>
          )}
          {elapsedTime > 0 && (
            <div className="text-sm font-mono text-muted-foreground">
              {formatTime(elapsedTime)}
            </div>
          )}
        </div>
      </div>
      {requestId && (
        <p className="text-xs text-muted-foreground font-mono truncate">
          Request ID: {requestId}
        </p>
      )}
      {debugInfo && (
        <details className="text-xs">
          <summary className="text-muted-foreground cursor-pointer">Debug Info</summary>
          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
            {debugInfo}
          </pre>
        </details>
      )}
    </div>
  )
}
