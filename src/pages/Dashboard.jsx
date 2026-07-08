import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useScripts } from '../context/ScriptsContext'
import { useAuth } from '../context/AuthContext'
import ScriptCard from '../components/dashboard/ScriptCard'
import { CardSkeleton, Modal } from '../components/ui/index.jsx'
import { Input } from '../components/ui/index.jsx'
import Button from '../components/ui/Button'

const FILTERS = ['All', 'Favorites', 'Archived']

export default function Dashboard() {
  const { user } = useAuth()
  const { scripts, loading, createScript, updateScript, deleteScript, duplicateScript } = useScripts()
  const navigate = useNavigate()
  const [query, setQuery]         = useState('')
  const [filter, setFilter]       = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle]   = useState('')

  const filtered = useMemo(() => {
    let list = scripts
    if (filter === 'Favorites') list = list.filter(s => s.favorite)
    else if (filter === 'Archived') list = list.filter(s => s.archived)
    else list = list.filter(s => !s.archived)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(s => s.title?.toLowerCase().includes(q) || s.tags?.some(t => t.toLowerCase().includes(q)) || s.folder?.toLowerCase().includes(q))
    }
    return list
  }, [scripts, filter, query])

  const handleCreate = async () => {
    const s = await createScript({ title: newTitle.trim() || 'Untitled Script' })
    setShowModal(false); setNewTitle(''); navigate(`/editor/${s.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">
            Welcome back, {user?.name?.split(' ')[0] || 'writer'}
          </h1>
          <p className="mt-1 text-sm text-ink-400">{scripts.filter(s => !s.archived).length} scripts in your vault</p>
        </div>
        <Button icon={FiPlus} onClick={() => setShowModal(true)}>New script</Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={15}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search scripts, tags, folders…"
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-400 focus:border-amber-accent focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"/>
        </div>
        <div className="flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-900 dark:text-ink-100' : 'text-ink-500 dark:text-ink-400'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i) => <CardSkeleton key={i}/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-20 text-center dark:border-ink-700">
          <p className="mb-1 font-display text-lg font-medium text-ink-700 dark:text-ink-200">{query ? 'No matches' : 'Your vault is empty'}</p>
          <p className="mb-5 text-sm text-ink-400">{query ? 'Try a different search term.' : 'Start your first screenplay.'}</p>
          {!query && <Button icon={FiPlus} onClick={() => setShowModal(true)}>Create your first script</Button>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => (
            <ScriptCard key={s.id} script={s}
              onToggleFavorite={s => updateScript({...s, favorite: !s.favorite})}
              onDuplicate={async s => { await duplicateScript(s.id); toast.success('Duplicated') }}
              onDelete={async s => { await deleteScript(s.id); toast.success('Deleted') }}
              onArchive={s => { updateScript({...s, archived: !s.archived}); toast.success(s.archived ? 'Restored' : 'Archived') }}
            />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New script"
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></>}>
        <Input label="Title" autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Untitled Script"
          onKeyDown={e => e.key === 'Enter' && handleCreate()}/>
      </Modal>
    </div>
  )
}
