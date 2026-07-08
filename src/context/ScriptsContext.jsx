import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { scriptStore, createEmptyScript } from '../services/scriptStore'
import { useAuth } from './AuthContext'

const ScriptsCtx = createContext(null)

export function ScriptsProvider({ children }) {
  const { user } = useAuth()
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) { setScripts([]); setLoading(false); return }
    setLoading(true)
    setScripts(await scriptStore.getAll(user.id))
    setLoading(false)
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  const createScript = useCallback(async (overrides) => {
    const s = createEmptyScript(user.id, overrides)
    await scriptStore.save(s)
    await refresh()
    return s
  }, [user, refresh])

  const updateScript = useCallback(async (script) => {
    const saved = await scriptStore.save(script)
    setScripts(prev => {
      const exists = prev.some(s => s.id === saved.id)
      const next   = exists ? prev.map(s => s.id === saved.id ? saved : s) : [saved, ...prev]
      return [...next].sort((a, b) => b.updatedAt - a.updatedAt)
    })
    return saved
  }, [])

  const deleteScript = useCallback(async (id) => {
    await scriptStore.remove(id)
    setScripts(prev => prev.filter(s => s.id !== id))
  }, [])

  const duplicateScript = useCallback(async (id) => {
    const orig = scripts.find(s => s.id === id)
    if (!orig) return
    const copy = createEmptyScript(user.id, { ...orig, id: crypto.randomUUID(), title: `${orig.title} (Copy)`, createdAt: Date.now() })
    await scriptStore.save(copy)
    await refresh()
    return copy
  }, [scripts, user, refresh])

  const getScript = useCallback(id => scriptStore.get(id), [])

  return (
    <ScriptsCtx.Provider value={{ scripts, loading, refresh, createScript, updateScript, deleteScript, duplicateScript, getScript }}>
      {children}
    </ScriptsCtx.Provider>
  )
}

export const useScripts = () => { const c = useContext(ScriptsCtx); if (!c) throw new Error('useScripts outside provider'); return c }
