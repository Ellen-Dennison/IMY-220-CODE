import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) 
  { return { error } }

  componentDidCatch(error, info) 
  { console.error('App crashed:', error, info.componentStack) }

  render() {
    if (this.state.error) 
    {
      return (
        <div className="min-h-screen bg-hot text-white p-8">
          <h1 className="font-display text-4xl mb-4">Something went wrong</h1>
          <p className="font-mono mb-4">The page hit a runtime error. Reload to try again.</p>
          <pre className="bg-white text-ink p-4 rounded overflow-auto text-sm mb-4 whitespace-pre-wrap">
            {this.state.error.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="bg-azure text-white font-bold px-5 py-2 border-2 border-white"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}