import { Link } from 'react-router-dom'
import { FiFeather } from 'react-icons/fi'
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm animate-fade-up">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-accent text-white"><FiFeather size={15}/></div>
          <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">ScriptVault</span>
        </Link>
        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="mb-1 font-display text-xl font-semibold text-ink-900 dark:text-ink-100">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-ink-400">{subtitle}</p>}
          {children}
        </div>
        {footer && <p className="mt-5 text-center text-sm text-ink-400">{footer}</p>}
      </div>
    </div>
  )
}
