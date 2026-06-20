import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useScripts } from '../context/ScriptsContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { scripts } = useScripts()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    updateProfile({ name })
    setSaving(false)
    toast.success('Profile updated')
  }

  const favoriteCount = scripts.filter((s) => s.favorite).length
  const archivedCount = scripts.filter((s) => s.archived).length

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
            <p className="text-sm text-ink-400">{user?.isGuest ? 'Guest account (not saved across devices)' : user?.email}</p>
          </div>
        </div>

        {!user?.isGuest && (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" disabled={saving} className="self-start">
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <p className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">{scripts.length}</p>
          <p className="text-xs text-ink-400">Total scripts</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">{favoriteCount}</p>
          <p className="text-xs text-ink-400">Favorites</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">{archivedCount}</p>
          <p className="text-xs text-ink-400">Archived</p>
        </Card>
      </div>
    </div>
  )
}
