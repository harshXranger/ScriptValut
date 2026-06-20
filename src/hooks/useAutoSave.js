import { useEffect, useRef, useState, useCallback } from 'react'

// Auto-saves `value` via `onSave` every `interval` ms when it changes, and
// writes an instant synchronous draft (via onDraft) on every keystroke so a
// refresh never loses data even before the debounced save fires.
export function useAutoSave({ value, onSave, onDraft, interval = 5000 }) {
  const [status, setStatus] = useState('saved') // 'saved' | 'saving' | 'unsaved'
  const lastSaved = useRef(value)
  const timerRef = useRef(null)

  useEffect(() => {
    if (value === lastSaved.current) return
    setStatus('unsaved')
    if (onDraft) onDraft(value)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setStatus('saving')
      await onSave(value)
      lastSaved.current = value
      setStatus('saved')
    }, interval)

    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('saving')
    await onSave(value)
    lastSaved.current = value
    setStatus('saved')
  }, [value, onSave])

  return { status, saveNow }
}
