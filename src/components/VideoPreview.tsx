import { Download, Play, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

interface VideoPreviewProps {
  videoUrl: string | null
  onReset: () => void
}

export function VideoPreview({ videoUrl, onReset }: VideoPreviewProps) {
  if (!videoUrl) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xai-video-${Date.now()}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(videoUrl, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="bg-black/50 hover:bg-black/70">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDownload} className="flex-1" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={onReset} className="flex-1" variant="secondary">
          <RotateCcw className="h-4 w-4 mr-2" />
          Generate New
        </Button>
      </div>
    </div>
  )
}
