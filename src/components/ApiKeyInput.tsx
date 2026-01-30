import { useState } from 'react'
import { Eye, EyeOff, Key } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key" className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        API Key
      </Label>
      <div className="relative">
        <Input
          id="api-key"
          type={showKey ? 'text' : 'password'}
          placeholder="Enter your xAI API key"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally and never sent to our servers.
      </p>
    </div>
  )
}
