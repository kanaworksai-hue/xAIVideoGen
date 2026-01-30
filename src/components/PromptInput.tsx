import { MessageSquare } from 'lucide-react'
import { Label } from './ui/label'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Prompt <span className="text-destructive">*</span>
      </Label>
      <textarea
        id="prompt"
        placeholder="Describe the video you want to generate..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />
    </div>
  )
}
