const USERS_KEY   = 'sv:users'
const SESSION_KEY = 'sv:session'

const getUsers  = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] } }
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u))

export const authService = {
  signup({ name, email, password }) {
    const users = getUsers()
    if (users.some(u => u.email === email)) throw new Error('Account already exists.')
    const user = { id: crypto.randomUUID(), name, email, password, createdAt: Date.now() }
    saveUsers([...users, user])
    const session = { id: user.id, name, email, isGuest: false }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },
  login({ email, password }) {
    const user = getUsers().find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password.')
    const session = { id: user.id, name: user.name, email, isGuest: false }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },
  loginAsGuest() {
    const session = { id: `guest-${crypto.randomUUID()}`, name: 'Guest Writer', email: null, isGuest: true }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },
  logout()       { localStorage.removeItem(SESSION_KEY) },
  getSession()   { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null } },
  updateProfile(updates) {
    const s = authService.getSession()
    if (!s) return null
    const merged = { ...s, ...updates }
    localStorage.setItem(SESSION_KEY, JSON.stringify(merged))
    if (!s.isGuest) saveUsers(getUsers().map(u => u.id === s.id ? { ...u, ...updates } : u))
    return merged
  },
}
