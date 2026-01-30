import { MonitorIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import type { Resolution } from '../types'

interface ResolutionSelectProps {
  value: Resolution
  onChange: (value: Resolution) => void
  disabled?: boolean
}

const resolutions: { value: Resolution; label: string }[] = [
  { value: '720p', label: '720p (HD)' },
  { value: '480p', label: '480p (SD)' },
]

export function ResolutionSelect({ value, onChange, disabled }: ResolutionSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <MonitorIcon className="h-4 w-4" />
        Resolution
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {resolutions.map((res) => (
            <SelectItem key={res.value} value={res.value}>
              {res.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
