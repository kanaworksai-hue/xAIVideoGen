import { Clock } from 'lucide-react'
import { Slider } from './ui/slider'
import { Label } from './ui/label'

interface DurationSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function DurationSlider({ value, onChange, disabled }: DurationSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Duration
        </Label>
        <span className="text-sm font-medium text-primary">{value}s</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={15}
        step={1}
        disabled={disabled}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1s</span>
        <span>15s</span>
      </div>
    </div>
  )
}
