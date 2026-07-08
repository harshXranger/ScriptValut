import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import Sidebar from '../components/layout/Sidebar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
      <div className="hidden md:flex"><Sidebar/></div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setMobileOpen(false)}/>
          <div className="relative animate-fade-up"><Sidebar onNavigate={() => setMobileOpen(false)}/></div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900 md:hidden">
          <button onClick={() => setMobileOpen(o => !o)} className="rounded-lg p-1.5 text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
            {mobileOpen ? <FiX size={20}/> : <FiMenu size={20}/>}
          </button>
          <span className="font-display font-semibold text-ink-900 dark:text-ink-100">ScriptVault</span>
        </div>
        <main className="min-w-0 flex-1 overflow-y-auto"><Outlet/></main>
      </div>
    </div>
  )
}
