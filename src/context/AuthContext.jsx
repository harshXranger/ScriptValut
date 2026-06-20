import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())

  const login = useCallback((creds) => {
    const session = authService.login(creds)
    setUser(session)
    return session
  }, [])

  const signup = useCallback((data) => {
    const session = authService.signup(data)
    setUser(session)
    return session
  }, [])

  const loginAsGuest = useCallback(() => {
    const session = authService.loginAsGuest()
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    const merged = authService.updateProfile(updates)
    setUser(merged)
    return merged
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, loginAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
