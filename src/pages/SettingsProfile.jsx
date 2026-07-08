// ─── Settings ──────────────────────────────────────────────────────────────
import toast from 'react-hot-toast'
import { FiSun, FiMoon, FiDownload, FiTrash2 } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { useScripts } from '../context/ScriptsContext'
import { Card } from '../components/ui/index.jsx'
import Button from '../components/ui/Button'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { scripts } = useScripts()

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(scripts, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'scriptvault-backup.json' })
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success('Backup downloaded')
  }

  const clearDraftCache = () => {
    Object.keys(localStorage).filter(k => k.startsWith('sv:draft:')).forEach(k => localStorage.removeItem(k))
    toast.success('Draft cache cleared')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">Settings</h1>

      <Card className="mb-5 p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">Appearance</h2>
        <p className="mb-4 text-sm text-ink-400">Choose how ScriptVault looks on this device.</p>
        <div className="flex gap-3">
          {[{v:'light',icon:FiSun,label:'Light'},{v:'dark',icon:FiMoon,label:'Dark'}].map(({v,icon:Icon,label}) => (
            <button key={v} onClick={() => setTheme(v)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${theme === v ? 'border-amber-accent bg-amber-accent/10 text-amber-accent' : 'border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300'}`}>
              <Icon size={15}/>{label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">Data &amp; storage</h2>
        <p className="mb-4 text-sm text-ink-400">{scripts.length} script{scripts.length === 1 ? '' : 's'} stored in IndexedDB on this device.</p>
        <div className="flex flex-wrap gap-3">
          <Button icon={FiDownload} variant="secondary" onClick={exportAll}>Export all (JSON)</Button>
          <Button icon={FiTrash2}   variant="danger"    onClick={clearDraftCache}>Clear draft cache</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">About</h2>
        <p className="text-sm text-ink-400">ScriptVault v2.0 — rich text formatting, auto-save, PDF export, dark mode. No backend, fully local.</p>
      </Card>
    </div>
  )
}

// ─── Profile ───────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/index.jsx'

export function Profile() {
  const { user, updateProfile } = useAuth()
  const { scripts } = useScripts()
  const [name, setName]     = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    updateProfile({ name }); setSaving(false); toast.success('Profile updated')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">Profile</h1>
      <Card className="mb-5 p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-accent/15 font-display text-2xl font-semibold text-amber-accent">
            {(user?.name || 'G')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">{user?.name}</p>
            <p className="text-sm text-ink-400">{user?.isGuest ? 'Guest account' : user?.email}</p>
          </div>
        </div>
        {!user?.isGuest && (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input label="Display name" value={name} onChange={e => setName(e.target.value)}/>
            <Button type="submit" disabled={saving} className="self-start">{saving ? 'Saving…' : 'Save changes'}</Button>
          </form>
        )}
      </Card>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total scripts', val: scripts.length },
          { label: 'Favorites',     val: scripts.filter(s => s.favorite).length },
          { label: 'Archived',      val: scripts.filter(s => s.archived).length },
        ].map(({ label, val }) => (
          <Card key={label} className="p-5 text-center">
            <p className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">{val}</p>
            <p className="text-xs text-ink-400">{label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
