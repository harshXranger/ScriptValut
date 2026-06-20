export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-ink-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900 ${
        hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-ink-200 dark:hover:border-ink-600' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
