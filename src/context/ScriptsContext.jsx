import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { scriptStore, createEmptyScript } from '../services/scriptStore'
import { useAuth } from './AuthContext'

const ScriptsContext = createContext(null)

export function ScriptsProvider({ children }) {
  const { user } = useAuth()
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setScripts([])
      setLoading(false)
      return
    }
    setLoading(true)
    const all = await scriptStore.getAll(user.id)
    setScripts(all)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createScript = useCallback(async (overrides) => {
    const script = createEmptyScript(user.id, overrides)
    await scriptStore.save(script)
    await refresh()
    return script
  }, [user, refresh])

  const updateScript = useCallback(async (script) => {
    const saved = await scriptStore.save(script)
    setScripts((prev) => {
      const exists = prev.some((s) => s.id === saved.id)
      const next = exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev]
      return [...next].sort((a, b) => b.updatedAt - a.updatedAt)
    })
    return saved
  }, [])

  const deleteScript = useCallback(async (id) => {
    await scriptStore.remove(id)
    setScripts((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const duplicateScript = useCallback(async (id) => {
    const original = scripts.find((s) => s.id === id)
    if (!original) return
    const copy = createEmptyScript(user.id, {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      createdAt: Date.now(),
    })
    await scriptStore.save(copy)
    await refresh()
    return copy
  }, [scripts, user, refresh])

  const getScript = useCallback((id) => scriptStore.get(id), [])

  return (
    <ScriptsContext.Provider
      value={{ scripts, loading, refresh, createScript, updateScript, deleteScript, duplicateScript, getScript }}
    >
      {children}
    </ScriptsContext.Provider>
  )
}

export function useScripts() {
  const ctx = useContext(ScriptsContext)
  if (!ctx) throw new Error('useScripts must be used within ScriptsProvider')
  return ctx
}
