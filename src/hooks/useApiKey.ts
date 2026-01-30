import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'xai-video-gen-api-key'

function obfuscate(value: string): string {
  return btoa(value.split('').reverse().join(''))
}

function deobfuscate(value: string): string {
  try {
    return atob(value).split('').reverse().join('')
  } catch {
    return ''
  }
}

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setApiKeyState(deobfuscate(stored))
    }
  }, [])

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    if (key) {
      localStorage.setItem(STORAGE_KEY, obfuscate(key))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const clearApiKey = useCallback(() => {
    setApiKeyState('')
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { apiKey, setApiKey, clearApiKey }
}
