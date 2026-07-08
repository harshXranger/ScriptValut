import { useMemo } from 'react'

export function useScriptStats(html) {
  return useMemo(() => {
    const text   = (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim()
    const words  = text.length ? text.split(/\s+/).filter(Boolean) : []
    return {
      wordCount:      words.length,
      charCount:      text.replace(/\s/g, '').length,
      readingMinutes: Math.max(1, Math.round(words.length / 200)),
      estimatedPages: Math.max(1, Math.round(words.length / 230)),
    }
  }, [html])
}
