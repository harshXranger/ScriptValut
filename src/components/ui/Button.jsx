const variants = {
  primary:   'bg-ink-900 text-white hover:bg-ink-700 dark:bg-amber-accent dark:text-ink-950 dark:hover:bg-amber-accent-dark',
  secondary: 'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700',
  ghost:     'bg-transparent text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
  danger:    'bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40',
}
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...p }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-accent disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...p}
    >
      {Icon && <Icon size={15} className="shrink-0" />}
      {children}
    </button>
  )
}
