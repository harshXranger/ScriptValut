import { Spinner } from '../ui/Loading'

export default function EditorStatusBar({ stats, status }) {
  const statusLabel = { saved: 'All changes saved', saving: 'Saving…', unsaved: 'Unsaved changes' }[status]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-1 py-3 text-xs text-ink-400 dark:border-ink-800">
      <div className="flex items-center gap-4">
        <span>{stats.wordCount.toLocaleString()} words</span>
        <span>{stats.charCount.toLocaleString()} characters</span>
        <span>~{stats.estimatedPages} pages</span>
        <span>{stats.readingMinutes} min read</span>
      </div>
      <div className="flex items-center gap-1.5">
        {status === 'saving' && <Spinner size={12} />}
        <span className={status === 'unsaved' ? 'text-amber-accent' : ''}>{statusLabel}</span>
      </div>
    </div>
  )
}
