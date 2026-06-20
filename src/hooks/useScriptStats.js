import { useMemo } from 'react'

export function useScriptStats(htmlContent) {
  return useMemo(() => {
    const text = (htmlContent || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim()
    const words = text.length ? text.split(/\s+/).filter(Boolean) : []
    const wordCount = words.length
    const charCount = text.replace(/\s/g, '').length
    // Screenplay convention: ~1 page per minute, ~200 words per page
    const readingMinutes = Math.max(1, Math.round(wordCount / 200))
    const estimatedPages = Math.max(1, Math.round(wordCount / 230))
    return { wordCount, charCount, readingMinutes, estimatedPages }
  }, [htmlContent])
}
