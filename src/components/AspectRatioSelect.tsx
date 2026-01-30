import { RatioIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import type { AspectRatio } from '../types'

interface AspectRatioSelectProps {
  value: AspectRatio
  onChange: (value: AspectRatio) => void
  disabled?: boolean
}

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '4:3', label: '4:3 (Standard)' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '3:4', label: '3:4 (Portrait)' },
  { value: '3:2', label: '3:2 (Photo)' },
  { value: '2:3', label: '2:3 (Photo Portrait)' },
]

export function AspectRatioSelect({ value, onChange, disabled }: AspectRatioSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <RatioIcon className="h-4 w-4" />
        Aspect Ratio
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {aspectRatios.map((ratio) => (
            <SelectItem key={ratio.value} value={ratio.value}>
              {ratio.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
