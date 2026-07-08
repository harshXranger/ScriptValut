// ─── Input ─────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', id, ...p }) {
  const inputId = id || p.name
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-200">{label}</label>}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-accent focus:outline-none focus:ring-2 focus:ring-amber-accent/20 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 ${className}`}
        {...p}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, ...p }) {
  return (
    <div
      className={`rounded-2xl border border-ink-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900 ${hover ? 'transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-ink-200 dark:hover:border-ink-600' : ''} ${className}`}
      {...p}
    >
      {children}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'
export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const h = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-pop-in relative w-full max-w-md rounded-2xl border border-ink-100 bg-white p-6 shadow-xl dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"><FiX size={18}/></button>
        </div>
        {children}
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

// ─── Loading ───────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin text-current" width={size} height={size} viewBox="0 0 24 24" fill="none" role="status">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
export function PageLoader() {
  return <div className="flex h-full min-h-[50vh] w-full items-center justify-center"><Spinner size={28} className="text-amber-accent"/></div>
}
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-3 h-4 w-2/3 rounded bg-ink-100 dark:bg-ink-800"/>
      <div className="mb-2 h-3 w-full rounded bg-ink-100 dark:bg-ink-800"/>
      <div className="h-3 w-1/2 rounded bg-ink-100 dark:bg-ink-800"/>
    </div>
  )
}
