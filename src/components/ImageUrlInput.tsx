import { useState, useRef, useCallback, useEffect } from 'react'
import { ImageIcon, Upload, X, Link as LinkIcon, Key } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const IMGBB_KEY_STORAGE = 'imgbb_api_key'

interface ImageUrlInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUrlInput({ value, onChange, disabled }: ImageUrlInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(IMGBB_KEY_STORAGE)
    if (stored) {
      setApiKey(stored)
    }
  }, [])

  // Update preview when value changes externally
  const [previousValue, setPreviousValue] = useState(value)
  if (value !== previousValue) {
    setPreviousValue(value)
    if (value && !value.startsWith('data:')) {
      setPreviewUrl(value)
    } else if (!value) {
      setPreviewUrl(null)
    }
  }

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!apiKey) {
      throw new Error('Please enter your imgbb API key first')
    }

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `Upload failed: ${response.status}`)
    }

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.data.url
  }, [apiKey])

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    if (file.size > 32 * 1024 * 1024) {
      setUploadError('Image size must be less than 32MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const url = await uploadImage(file)
      onChange(url)
      setUploadError(null)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onChange, uploadImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          e.preventDefault()
          handleFile(file)
          break
        }
      }
    }
  }, [handleFile])

  const handleClear = useCallback(() => {
    onChange('')
    setPreviewUrl(null)
    setUploadError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [onChange])

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value
    setApiKey(newKey)
    localStorage.setItem(IMGBB_KEY_STORAGE, newKey)
  }, [])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreviewUrl(url || null)
    setUploadError(null)
  }, [onChange])

  return (
    <div className="space-y-3">
      <Label htmlFor="image-input" className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        Image <span className="text-muted-foreground text-xs">(optional)</span>
      </Label>

      {/* imgbb API Key Input */}
      <div className="flex gap-2 items-center">
        <Key className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          type="password"
          placeholder="imgbb API Key (required for upload)"
          value={apiKey}
          onChange={handleApiKeyChange}
          disabled={disabled || isUploading}
          className="flex-1"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Get a free API key at{' '}
        <a
          href="https://api.imgbb.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          api.imgbb.com
        </a>
        {' '}for image upload
      </p>

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onPaste={disabled ? undefined : handlePaste}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg bg-muted"
            />
            {!isUploading && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">
                  {isDragging ? 'Drop image here' : 'Upload or drag & drop image'}
                </p>
                <p className="text-xs text-muted-foreground">
                  or paste from clipboard (Ctrl+V)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input as alternative */}
      <div className="flex gap-2 items-center">
        <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          ref={inputRef}
          type="url"
          placeholder="Or enter image URL directly"
          value={value}
          onChange={handleUrlChange}
          disabled={disabled || isUploading}
          className="flex-1"
        />
        {value && !isUploading && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Upload an image or provide a URL directly. Max 32MB.
      </p>
    </div>
  )
}
