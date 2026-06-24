import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-20 max-w-md rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/40">
          <h2 className="mb-2 text-lg font-semibold text-rose-700 dark:text-rose-300">Ada error 😢</h2>
          <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">
            {String(this.state.error?.message || this.state.error || 'Unknown error')}
          </p>
          <button onClick={() => location.reload()} className="btn-primary">Muat ulang</button>
        </div>
      )
    }
    return this.props.children
  }
}
