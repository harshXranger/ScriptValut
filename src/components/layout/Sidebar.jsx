import { NavLink } from 'react-router-dom'
import { FiHome, FiSettings, FiUser, FiFeather, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/settings', label: 'Settings', icon: FiSettings },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink-100 bg-white px-4 py-6 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-accent text-white">
          <FiFeather size={16} />
        </div>
        <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">ScriptVault</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink-900 text-white dark:bg-amber-accent dark:text-ink-950'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-ink-100 pt-4 dark:border-ink-800">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
            {(user?.name || 'G')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-100">{user?.name}</p>
            <p className="truncate text-xs text-ink-400">{user?.isGuest ? 'Guest mode' : user?.email}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
        >
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <FiLogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  )
}
