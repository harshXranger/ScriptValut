import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiStar, FiCopy, FiTrash2, FiArchive, FiClock } from 'react-icons/fi'
import Card from '../ui/Card'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function ScriptCard({ script, onToggleFavorite, onDuplicate, onDelete, onArchive }) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const preview = (script.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110)

  return (
    <Card hover className="group flex cursor-pointer flex-col p-5" onClick={() => navigate(`/editor/${script.id}`)}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">
          {script.title || 'Untitled Script'}
        </h3>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(script) }}
          aria-label={script.favorite ? 'Unfavorite' : 'Favorite'}
          className={`shrink-0 rounded-lg p-1 ${script.favorite ? 'text-amber-accent' : 'text-ink-300 hover:text-amber-accent'}`}
        >
          <FiStar size={16} fill={script.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-ink-400">
        {preview || 'No content yet — start writing.'}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {script.folder || 'Uncategorized'}
        </span>
        {script.tags?.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-amber-accent/10 px-2.5 py-1 text-[11px] font-medium text-amber-accent">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
        <span className="flex items-center gap-1.5 text-xs text-ink-400">
          <FiClock size={12} /> {timeAgo(script.updatedAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(script) }}
            aria-label="Duplicate script"
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800"
          >
            <FiCopy size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onArchive(script) }}
            aria-label="Archive script"
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800"
          >
            <FiArchive size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirmDelete) { onDelete(script); } else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 2500) }
            }}
            aria-label="Delete script"
            className={`rounded-lg p-1.5 ${confirmDelete ? 'bg-red-500 text-white' : 'text-ink-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30'}`}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  )
}
