import { Loader2, Sparkles, Wand2 } from 'lucide-react'
import { Button } from './ui/button'

interface GenerateButtonProps {
  onClick: () => void
  isGenerating: boolean
  disabled?: boolean
  mode?: 'generate' | 'edit'
}

export function GenerateButton({ onClick, isGenerating, disabled, mode = 'generate' }: GenerateButtonProps) {
  const isEdit = mode === 'edit'

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`w-full ${isEdit
        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
      } text-white font-semibold py-6 text-lg transition-all duration-200`}
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {isEdit ? 'Editing...' : 'Generating...'}
        </>
      ) : (
        <>
          {isEdit ? <Wand2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          {isEdit ? 'Edit Video' : 'Generate Video'}
        </>
      )}
    </Button>
  )
}
