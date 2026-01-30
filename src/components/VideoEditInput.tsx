import { useCallback } from 'react'
import { Video as VideoIcon, Link as LinkIcon, X } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

interface VideoEditInputProps {
  videoUrl: string
  editPrompt: string
  onVideoUrlChange: (url: string) => void
  onEditPromptChange: (prompt: string) => void
  disabled?: boolean
}

export function VideoEditInput({
  videoUrl,
  editPrompt,
  onVideoUrlChange,
  onEditPromptChange,
  disabled,
}: VideoEditInputProps) {
  const handleClear = useCallback(() => {
    onVideoUrlChange('')
  }, [onVideoUrlChange])

  return (
    <div className="space-y-4">
      {/* Video URL Input */}
      <div className="space-y-2">
        <Label htmlFor="video-url" className="flex items-center gap-2">
          <VideoIcon className="h-4 w-4" />
          Source Video <span className="text-destructive">*</span>
        </Label>

        {videoUrl ? (
          <div className="space-y-2">
            <div className="relative border rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                className="w-full max-h-48 object-contain bg-muted"
                controls
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleClear}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                id="video-url"
                type="url"
                placeholder="Enter video URL"
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                disabled={disabled}
                className="flex-1"
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              id="video-url"
              type="url"
              placeholder="Enter video URL"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              disabled={disabled}
              className="flex-1"
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Video must be a direct link (URL ending in .mp4, .webm, etc.). Sharing links from Google Drive, Dropbox, YouTube, etc. are not supported. Max 8.7 seconds.
        </p>
      </div>

      {/* Edit Prompt */}
      <div className="space-y-2">
        <Label htmlFor="edit-prompt" className="flex items-center gap-2">
          <VideoIcon className="h-4 w-4" />
          Edit Instructions <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="edit-prompt"
          placeholder="Describe the changes you want to make to the video...&#10;Examples:&#10;- Make the ball in the video larger&#10;- Change the background to a sunset&#10;- Add slow motion effect&#10;- Make the colors more vibrant"
          value={editPrompt}
          onChange={(e) => onEditPromptChange(e.target.value)}
          disabled={disabled}
          rows={6}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical min-h-[120px]"
        />
      </div>
    </div>
  )
}
