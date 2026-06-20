import { Component } from 'react'
import Button from './ui/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ScriptVault crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center dark:bg-ink-950">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-100">
            Something went off-script
          </h1>
          <p className="max-w-md text-sm text-ink-400">
            An unexpected error occurred. Your scripts are safely stored locally — reloading the page should fix it.
          </p>
          <Button onClick={() => window.location.reload()}>Reload ScriptVault</Button>
        </div>
      )
    }
    return this.props.children
  }
}
