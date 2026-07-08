import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiStar, FiCopy, FiTrash2, FiArchive, FiClock } from 'react-icons/fi'
import { Card } from '../ui/index.jsx'

function timeAgo(ts) {
  const d = Date.now() - ts, m = Math.floor(d/60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h/24)
  return days < 30 ? `${days}d ago` : new Date(ts).toLocaleDateString()
}

export default function ScriptCard({ script, onToggleFavorite, onDuplicate, onDelete, onArchive }) {
  const navigate = useNavigate()
  const [confirmDel, setConfirmDel] = useState(false)
  const preview = (script.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110)

  return (
    <Card hover className="group flex cursor-pointer flex-col p-5" onClick={() => navigate(`/editor/${script.id}`)}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">
          {script.title || 'Untitled Script'}
        </h3>
        <button onClick={e => { e.stopPropagation(); onToggleFavorite(script) }}
          className={`shrink-0 rounded-lg p-1 ${script.favorite ? 'text-amber-accent' : 'text-ink-300 hover:text-amber-accent'}`}>
          <FiStar size={15} fill={script.favorite ? 'currentColor' : 'none'}/>
        </button>
      </div>

      <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-ink-400">{preview || 'No content yet.'}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {script.folder || 'Uncategorized'}
        </span>
        {script.tags?.slice(0,2).map(t => (
          <span key={t} className="rounded-full bg-amber-accent/10 px-2.5 py-1 text-[11px] font-medium text-amber-accent">#{t}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
        <span className="flex items-center gap-1.5 text-[11px] text-ink-400">
          <FiClock size={11}/>{timeAgo(script.updatedAt)}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={e => { e.stopPropagation(); onDuplicate(script) }} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"><FiCopy size={13}/></button>
          <button onClick={e => { e.stopPropagation(); onArchive(script) }}   className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"><FiArchive size={13}/></button>
          <button
            onClick={e => { e.stopPropagation(); if (confirmDel) onDelete(script); else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 2500) } }}
            className={`rounded-lg p-1.5 ${confirmDel ? 'bg-red-500 text-white' : 'text-ink-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30'}`}>
            <FiTrash2 size={13}/>
          </button>
        </div>
      </div>
    </Card>
  )
}
