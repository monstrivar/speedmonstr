import { Component } from "react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-lg font-semibold">Noe gikk galt</p>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Appen har krasjet. Prøv å laste siden på nytt.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            onClick={() => window.location.reload()}
          >
            Last inn på nytt
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
