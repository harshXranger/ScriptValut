import toast from 'react-hot-toast'
import { FiSun, FiMoon, FiDownload, FiTrash2 } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { useScripts } from '../context/ScriptsContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { scripts } = useScripts()

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(scripts, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scriptvault-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup downloaded')
  }

  const handleClearAutosaveCache = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('scriptvault:draft:'))
      .forEach((k) => localStorage.removeItem(k))
    toast.success('Draft cache cleared')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">Settings</h1>

      <Card className="mb-5 p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">Appearance</h2>
        <p className="mb-4 text-sm text-ink-400">Choose how ScriptVault looks on this device.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              theme === 'light' ? 'border-amber-accent bg-amber-accent/10 text-amber-accent' : 'border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300'
            }`}
          >
            <FiSun size={16} /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              theme === 'dark' ? 'border-amber-accent bg-amber-accent/10 text-amber-accent' : 'border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300'
            }`}
          >
            <FiMoon size={16} /> Dark
          </button>
        </div>
      </Card>

      <Card className="mb-5 p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">Data &amp; storage</h2>
        <p className="mb-4 text-sm text-ink-400">
          Scripts are stored in this browser's IndexedDB ({scripts.length} script{scripts.length === 1 ? '' : 's'}).
          Export a full backup as JSON, or clear cached unsaved drafts.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button icon={FiDownload} variant="secondary" onClick={handleExportAll}>
            Export all scripts (JSON)
          </Button>
          <Button icon={FiTrash2} variant="danger" onClick={handleClearAutosaveCache}>
            Clear draft cache
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-100">About</h2>
        <p className="text-sm text-ink-400">
          ScriptVault v1.0 — a local-first screenplay editor. AI-assisted writing tools (story plotting,
          character generation, dialogue suggestions) are planned for a future release.
        </p>
      </Card>
    </div>
  )
}
