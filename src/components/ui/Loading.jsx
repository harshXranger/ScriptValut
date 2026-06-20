export function Spinner({ size = 20, className = '' }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
      <Spinner size={28} className="text-amber-accent" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-3 h-4 w-2/3 rounded bg-ink-100 dark:bg-ink-800" />
      <div className="mb-2 h-3 w-full rounded bg-ink-100 dark:bg-ink-800" />
      <div className="h-3 w-1/2 rounded bg-ink-100 dark:bg-ink-800" />
    </div>
  )
}
