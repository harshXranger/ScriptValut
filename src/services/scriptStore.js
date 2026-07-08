import { openDB } from 'idb'

const DB_NAME = 'scriptvault-db'
const DB_VER  = 1
const STORE   = 'scripts'

let _db = null
function getDB() {
  if (!_db) {
    _db = openDB(DB_NAME, DB_VER, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: 'id' })
          s.createIndex('userId',    'userId')
          s.createIndex('updatedAt', 'updatedAt')
        }
      },
    })
  }
  return _db
}

export const scriptStore = {
  async getAll(userId) {
    const db  = await getDB()
    const all = await db.getAll(STORE)
    return all.filter(s => s.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt)
  },
  async get(id) { return (await getDB()).get(STORE, id) },

  async save(script) {
    const db   = await getDB()
    const item = { ...script, updatedAt: Date.now() }
    await db.put(STORE, item)
    // Mirror lightweight meta for fast dashboard reads
    try {
      const meta = JSON.parse(localStorage.getItem('sv:meta') || '{}')
      meta[item.id] = { id: item.id, title: item.title, updatedAt: item.updatedAt, userId: item.userId }
      localStorage.setItem('sv:meta', JSON.stringify(meta))
    } catch {}
    return item
  },

  async remove(id) {
    await (await getDB()).delete(STORE, id)
    try {
      const meta = JSON.parse(localStorage.getItem('sv:meta') || '{}')
      delete meta[id]
      localStorage.setItem('sv:meta', JSON.stringify(meta))
    } catch {}
    localStorage.removeItem(`sv:draft:${id}`)
  },

  // Instant localStorage draft (survives hard-refresh before IndexedDB save fires)
  saveDraft(id, content) {
    try { localStorage.setItem(`sv:draft:${id}`, JSON.stringify({ content, savedAt: Date.now() })) } catch {}
  },
  getDraft(id) {
    try { return JSON.parse(localStorage.getItem(`sv:draft:${id}`) || 'null') } catch { return null }
  },
  clearDraft(id) { localStorage.removeItem(`sv:draft:${id}`) },
}

export function createEmptyScript(userId, overrides = {}) {
  const now = Date.now()
  return {
    id:        crypto.randomUUID(),
    userId,
    title:     'Untitled Script',
    content:   '<div class="scene-heading">INT. LOCATION - DAY</div><div class="action">Start writing your story here...</div>',
    folder:    'Uncategorized',
    tags:      [],
    favorite:  false,
    archived:  false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
