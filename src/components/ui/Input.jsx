export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-600 dark:text-ink-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-amber-accent focus:outline-none focus:ring-2 focus:ring-amber-accent/20 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}
