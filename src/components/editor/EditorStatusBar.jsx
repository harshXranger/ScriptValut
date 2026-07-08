import { FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi'

const icons = {
  saved:   <FiCheck   size={12} className="text-green-500" />,
  saving:  <FiLoader  size={12} className="animate-spin text-amber-accent" />,
  unsaved: <FiAlertCircle size={12} className="text-amber-accent" />,
}
const labels = { saved: 'Saved', saving: 'Saving…', unsaved: 'Unsaved changes' }

export default function EditorStatusBar({ stats, status }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-1 py-3 text-[11px] text-ink-400 dark:border-ink-800">
      <div className="flex items-center gap-4">
        <span><strong className="text-ink-700 dark:text-ink-200">{stats.wordCount.toLocaleString()}</strong> words</span>
        <span><strong className="text-ink-700 dark:text-ink-200">{stats.charCount.toLocaleString()}</strong> chars</span>
        <span>~<strong className="text-ink-700 dark:text-ink-200">{stats.estimatedPages}</strong> pages</span>
        <span><strong className="text-ink-700 dark:text-ink-200">{stats.readingMinutes}</strong> min read</span>
      </div>
      <div className="flex items-center gap-1.5">
        {icons[status]}
        <span>{labels[status]}</span>
      </div>
    </div>
  )
}
