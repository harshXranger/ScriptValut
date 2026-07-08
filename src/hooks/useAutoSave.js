import { useCallback, useEffect, useRef, useState } from 'react'

export function useAutoSave({ value, onSave, onDraft, interval = 5000 }) {
  const [status, setStatus]   = useState('saved')
  const lastSaved              = useRef(value)
  const timer                  = useRef(null)

  useEffect(() => {
    if (value === lastSaved.current) return
    setStatus('unsaved')
    onDraft?.(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setStatus('saving')
      await onSave(value)
      lastSaved.current = value
      setStatus('saved')
    }, interval)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const saveNow = useCallback(async () => {
    clearTimeout(timer.current)
    setStatus('saving')
    await onSave(value)
    lastSaved.current = value
    setStatus('saved')
  }, [value, onSave])

  return { status, saveNow }
}
