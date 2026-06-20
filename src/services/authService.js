const USERS_KEY = 'scriptvault:users'
const SESSION_KEY = 'scriptvault:session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// NOTE: This is a client-only demo auth layer (no real backend / hashing).
// Swap these functions for real API calls when a backend is wired up.
export const authService = {
  signup({ name, email, password }) {
    const users = getUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    const user = { id: crypto.randomUUID(), name, email, password, createdAt: Date.now() }
    users.push(user)
    saveUsers(users)
    const session = { id: user.id, name: user.name, email: user.email, isGuest: false }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },

  login({ email, password }) {
    const users = getUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password.')
    const session = { id: user.id, name: user.name, email: user.email, isGuest: false }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },

  loginAsGuest() {
    const session = { id: 'guest-' + crypto.randomUUID(), name: 'Guest Writer', email: null, isGuest: true }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    } catch {
      return null
    }
  },

  updateProfile(updates) {
    const session = authService.getSession()
    if (!session) return null
    const merged = { ...session, ...updates }
    localStorage.setItem(SESSION_KEY, JSON.stringify(merged))
    if (!session.isGuest) {
      const users = getUsers().map((u) => (u.id === session.id ? { ...u, ...updates } : u))
      saveUsers(users)
    }
    return merged
  },
}
