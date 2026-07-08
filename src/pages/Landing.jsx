import { Link } from 'react-router-dom'
import { FiFeather, FiArrowRight, FiZap, FiDownload, FiFolder, FiType } from 'react-icons/fi'

const features = [
  { icon: FiType,     title: 'Rich Text Formatting', body: 'Bold, italic, underline, color, highlight, strikethrough — plus small-caps and five case transforms. Real creative control at your fingertips.' },
  { icon: FiZap,      title: 'Smart Auto-Save',       body: 'Every keystroke writes a local draft. IndexedDB saves flush every 5 seconds. Lose your wifi, close the tab — your script is still there.' },
  { icon: FiDownload, title: 'One-Click PDF Export',  body: 'Proper screenplay margins, Courier 12pt, title page — a broadcast-ready PDF in one click, no plugins needed.' },
  { icon: FiFolder,   title: 'Organized by Design',   body: 'Folders, tags, favorites, and archives keep a hundred drafts as tidy as a single one.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-accent text-white"><FiFeather size={15}/></div>
          <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">ScriptVault</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-500 hover:text-ink-900 dark:hover:text-ink-100">Log in</Link>
          <Link to="/signup" className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white dark:bg-amber-accent dark:text-ink-950">Get started</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pt-24">
        <h1 className="font-display text-5xl font-semibold leading-tight text-ink-900 dark:text-ink-100 md:text-7xl">
          Write scripts like a <span className="text-amber-accent">professional.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-400">
          A focused screenplay editor with rich text formatting, auto-save, PDF export, and a distraction-free writing mode — everything in your browser, nothing to install.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup" className="group flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white dark:bg-amber-accent dark:text-ink-950 hover:scale-105 active:scale-95 transition-transform">
            Start writing free <FiArrowRight className="transition-transform group-hover:translate-x-1" size={15}/>
          </Link>
          <Link to="/login" className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800">
            Log in
          </Link>
        </div>
      </section>

      {/* Editor preview */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xl dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-950">
            {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => <div key={c} className={`h-3 w-3 rounded-full ${c}`}/>)}
            <span className="ml-2 text-xs text-ink-400">ScriptVault — My Feature Film</span>
          </div>
          {/* Mock toolbar */}
          <div className="flex flex-wrap gap-2 border-b border-ink-100 px-4 py-3 dark:border-ink-800">
            {['Scene','Action','Character','Dialogue','Parens','Transition'].map(b => (
              <span key={b} className="rounded-lg border border-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-500 dark:border-ink-700">{b}</span>
            ))}
            <span className="mx-2 text-ink-200 dark:text-ink-700">|</span>
            {['B','I','U','S'].map(b => (
              <span key={b} className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-ink-500">{b}</span>
            ))}
            <span className="mx-2 text-ink-200 dark:text-ink-700">|</span>
            {['Color','Highlight','Case','Size','Line ↕','A↔A'].map(b => (
              <span key={b} className="rounded-lg border border-ink-100 px-2 py-1 text-[11px] text-ink-400 dark:border-ink-700">{b}</span>
            ))}
          </div>
          <div className="px-14 py-8 font-mono text-sm leading-loose text-ink-700 dark:text-ink-300">
            <p className="mb-4 font-bold uppercase tracking-wide">INT. WRITER'S STUDY — NIGHT</p>
            <p className="mb-4">Rain against glass. The cursor blinks. A story waits.</p>
            <p className="mb-1 ml-40 font-bold uppercase">SCREENWRITER</p>
            <p className="mb-4 ml-20">(leaning forward)</p>
            <p className="ml-20">This time I finish it.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink-900 dark:text-ink-100 md:text-3xl">
          Built for the whole writing process
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-accent/10 text-amber-accent"><Icon size={18}/></div>
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
