import { Link } from 'react-router-dom'
import { FiFeather, FiCloud, FiDownload, FiFolder, FiZap, FiMoon } from 'react-icons/fi'
import Button from '../components/ui/Button'

const features = [
  { icon: FiCloud, title: 'Never lose a draft', body: 'Every keystroke is saved locally and in IndexedDB — refresh, close the tab, or lose your wifi, your script is still there.' },
  { icon: FiDownload, title: 'Industry-format PDF export', body: 'One click turns your draft into a properly margined, Courier-set screenplay PDF, ready to send out.' },
  { icon: FiFolder, title: 'Organize your way', body: 'Folders, tags, favorites, and archives keep a hundred drafts as tidy as a single one.' },
  { icon: FiZap, title: 'Built for flow', body: 'Smart formatting shortcuts turn scene headings, dialogue, and action into muscle memory.' },
  { icon: FiMoon, title: 'Easy on the eyes', body: 'A calm light mode for the morning, a soft dark mode for the midnight rewrite.' },
  { icon: FiFeather, title: 'Distraction-free mode', body: 'Strip away the chrome and write — just the page, the cursor, and the story.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-accent text-white">
            <FiFeather size={16} />
          </div>
          <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">ScriptVault</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-100">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-12 text-center md:pt-20">
        <span className="animate-fade-up mb-6 inline-block rounded-full border border-ink-200 px-4 py-1.5 text-xs font-medium text-ink-500 dark:border-ink-700 dark:text-ink-400">
          Write. Format. Export. Repeat.
        </span>
        <h1 className="animate-fade-up font-display text-4xl font-semibold leading-tight text-ink-900 [animation-delay:80ms] dark:text-ink-100 md:text-6xl">
          The screenplay editor that
          <span className="text-amber-accent"> writes like a typewriter</span>, saves like the cloud.
        </h1>
        <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base text-ink-400 [animation-delay:160ms] md:text-lg">
          ScriptVault is a focused home for your scripts — proper screenplay formatting, automatic local
          backups, and one-click PDF export, all in a clean, distraction-free workspace.
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
          <Link to="/signup">
            <Button size="lg">Start writing free</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">Continue as guest</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="animate-fade-up mx-auto max-w-3xl rounded-2xl border border-ink-100 bg-white p-2 shadow-xl dark:border-ink-800 dark:bg-ink-900">
          <div className="rounded-xl bg-ink-50 px-8 py-10 font-mono text-sm leading-relaxed text-ink-700 dark:bg-ink-950 dark:text-ink-300">
            <p className="mb-4 font-bold uppercase">INT. WRITER'S DESK - NIGHT</p>
            <p className="mb-4">A cursor blinks. Outside, rain. Inside, only the hum of focus.</p>
            <p className="ml-16 font-bold uppercase">YOU</p>
            <p className="ml-8">(typing, certain)</p>
            <p className="ml-8">This time, I finish it.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink-900 dark:text-ink-100 md:text-3xl">
          Everything a script needs, nothing it doesn't
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-accent/10 text-amber-accent">
                <Icon size={18} />
              </div>
              <h3 className="mb-1.5 font-display text-base font-semibold text-ink-900 dark:text-ink-100">{title}</h3>
              <p className="text-sm text-ink-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100 px-6 py-8 text-center text-xs text-ink-400 dark:border-ink-800">
        © {new Date().getFullYear()} ScriptVault. Built for writers who finish things.
      </footer>
    </div>
  )
}
