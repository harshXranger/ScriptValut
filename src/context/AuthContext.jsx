import { createContext, useCallback, useContext, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())
  const login        = useCallback(c  => { const s = authService.login(c);        setUser(s); return s }, [])
  const signup       = useCallback(d  => { const s = authService.signup(d);       setUser(s); return s }, [])
  const loginAsGuest = useCallback(() => { const s = authService.loginAsGuest(); setUser(s); return s }, [])
  const logout       = useCallback(() => { authService.logout(); setUser(null) }, [])
  const updateProfile= useCallback(u  => { const s = authService.updateProfile(u); setUser(s); return s }, [])
  return <AuthContext.Provider value={{ user, login, signup, loginAsGuest, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth outside provider'); return c }
