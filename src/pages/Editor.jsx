import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiDownload, FiMaximize2, FiMinimize2, FiTag, FiFolder, FiStar } from 'react-icons/fi'
import { useScripts } from '../context/ScriptsContext'
import { scriptStore } from '../services/scriptStore'
import { exportScriptToPDF } from '../services/pdfExport'
import { useAutoSave } from '../hooks/useAutoSave'
import { useScriptStats } from '../hooks/useScriptStats'
import ScreenplayEditor from '../components/editor/ScreenplayEditor'
import EditorStatusBar from '../components/editor/EditorStatusBar'
import Button from '../components/ui/Button'
import { PageLoader } from '../components/ui/Loading'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getScript, updateScript } = useScripts()

  const [script, setScript] = useState(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [folder, setFolder] = useState('Uncategorized')
  const [loading, setLoading] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const recoveredRef = useRef(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getScript(id).then((s) => {
      if (!active || !s) return
      // Draft recovery: if a newer unsaved draft exists in localStorage, prefer it
      const draft = scriptStore.getDraft(id)
      const useDraft = draft && draft.savedAt > s.updatedAt
      if (useDraft && !recoveredRef.current) {
        recoveredRef.current = true
        toast('Recovered an unsaved draft from this session', { icon: '🛟' })
      }
      setScript(s)
      setContent(useDraft ? draft.content : s.content)
      setTitle(s.title)
      setFolder(s.folder || 'Uncategorized')
      setLoading(false)
    })
    return () => { active = false }
  }, [id, getScript])

  const stats = useScriptStats(content)

  const persist = useCallback(async (html) => {
    if (!script) return
    const saved = await updateScript({ ...script, content: html, title, folder })
    setScript(saved)
    scriptStore.clearDraft(id)
  }, [script, title, folder, updateScript, id])

  const persistDraft = useCallback((html) => {
    scriptStore.saveDraft(id, html)
  }, [id])

  const { status, saveNow } = useAutoSave({ value: content, onSave: persist, onDraft: persistDraft, interval: 5000 })

  // Recovery safety net: persist before the tab closes
  useEffect(() => {
    const handler = () => scriptStore.saveDraft(id, content)
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [id, content])

  const handleTitleBlur = async () => {
    if (!script) return
    const saved = await updateScript({ ...script, content, title: title.trim() || 'Untitled Script', folder })
    setScript(saved)
  }

  const handleToggleFavorite = async () => {
    if (!script) return
    const saved = await updateScript({ ...script, favorite: !script.favorite })
    setScript(saved)
  }

  const handleExport = async () => {
    await saveNow()
    exportScriptToPDF({ ...script, title, content })
    toast.success('PDF exported')
  }

  // Keyboard shortcut: Esc exits focus mode
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && focusMode) setFocusMode(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode])

  if (loading) return <PageLoader />
  if (!script) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-ink-400">Script not found.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
      </div>
    )
  }

  return (
    <div className={focusMode ? 'fixed inset-0 z-50 flex flex-col bg-ink-50 dark:bg-ink-950' : 'min-h-full'}>
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-ink-800 dark:bg-ink-900/90 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!focusMode && (
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Back to dashboard"
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <FiArrowLeft size={18} />
            </button>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="min-w-0 max-w-xs truncate bg-transparent font-display text-lg font-semibold text-ink-900 outline-none dark:text-ink-100 sm:max-w-sm"
            aria-label="Script title"
          />
          <button onClick={handleToggleFavorite} aria-label="Toggle favorite" className={script.favorite ? 'text-amber-accent' : 'text-ink-300 hover:text-amber-accent'}>
            <FiStar size={16} fill={script.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!focusMode && (
            <div className="hidden items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-1.5 text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400 sm:flex">
              <FiFolder size={12} /> {folder}
            </div>
          )}
          <Button size="sm" variant="secondary" icon={focusMode ? FiMinimize2 : FiMaximize2} onClick={() => setFocusMode((f) => !f)}>
            {focusMode ? 'Exit focus' : 'Focus mode'}
          </Button>
          <Button size="sm" icon={FiDownload} onClick={handleExport}>
            Export PDF
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-3xl">
          <ScreenplayEditor content={content} onChange={setContent} fullScreen={focusMode} />
          <EditorStatusBar stats={stats} status={status} />
        </div>
      </div>
    </div>
  )
}
