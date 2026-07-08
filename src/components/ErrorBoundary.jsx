import { Component } from 'react'
export default class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError)
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center dark:bg-ink-950">
          <h1 className="font-display text-2xl font-semibold dark:text-ink-100">Something went off-script</h1>
          <p className="text-sm text-ink-400">Your scripts are safely stored. Reloading should fix it.</p>
          <button onClick={() => window.location.reload()} className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-amber-accent dark:text-ink-950">
            Reload ScriptVault
          </button>
        </div>
      )
    return this.props.children
  }
}
