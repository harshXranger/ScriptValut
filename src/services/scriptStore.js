import { openDB } from 'idb'

const DB_NAME = 'scriptvault-db'
const DB_VERSION = 1
const STORE = 'scripts'

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' })
          store.createIndex('updatedAt', 'updatedAt')
          store.createIndex('userId', 'userId')
        }
      },
    })
  }
  return dbPromise
}

export const scriptStore = {
  async getAll(userId) {
    const db = await getDB()
    const all = await db.getAll(STORE)
    return all
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  },

  async get(id) {
    const db = await getDB()
    return db.get(STORE, id)
  },

  async save(script) {
    const db = await getDB()
    const toSave = { ...script, updatedAt: Date.now() }
    await db.put(STORE, toSave)
    // mirror lightweight metadata to localStorage for instant dashboard reads / crash recovery
    try {
      const meta = JSON.parse(localStorage.getItem('scriptvault:meta') || '{}')
      meta[toSave.id] = {
        id: toSave.id,
        title: toSave.title,
        updatedAt: toSave.updatedAt,
        userId: toSave.userId,
      }
      localStorage.setItem('scriptvault:meta', JSON.stringify(meta))
    } catch (e) {
      console.warn('localStorage mirror failed', e)
    }
    return toSave
  },

  async remove(id) {
    const db = await getDB()
    await db.delete(STORE, id)
    try {
      const meta = JSON.parse(localStorage.getItem('scriptvault:meta') || '{}')
      delete meta[id]
      localStorage.setItem('scriptvault:meta', JSON.stringify(meta))
    } catch (e) {
      console.warn('localStorage cleanup failed', e)
    }
  },

  // unsaved draft recovery (debounced raw content, written synchronously to localStorage)
  saveDraft(id, content) {
    try {
      localStorage.setItem(`scriptvault:draft:${id}`, JSON.stringify({ content, savedAt: Date.now() }))
    } catch (e) {
      console.warn('draft save failed', e)
    }
  },

  getDraft(id) {
    try {
      const raw = localStorage.getItem(`scriptvault:draft:${id}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  clearDraft(id) {
    localStorage.removeItem(`scriptvault:draft:${id}`)
  },
}

export function createEmptyScript(userId, overrides = {}) {
  const id = crypto.randomUUID()
  const now = Date.now()
  return {
    id,
    userId,
    title: 'Untitled Script',
    content: '<div class="scene-heading">INT. LOCATION - DAY</div><div class="action">Start writing your story here...</div>',
    folder: 'Uncategorized',
    tags: [],
    favorite: false,
    archived: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
