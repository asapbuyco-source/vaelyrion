import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h1 className="font-serif text-2xl text-stone-900">Something went wrong</h1>
          <p className="text-xs text-stone-500 font-light max-w-sm">
            The page could not be displayed. Please refresh, or return to the collection.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#141414] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-xs"
            >
              Refresh
            </button>
            <a
              href="/"
              className="border border-[#141414]/20 text-[#141414] text-xs uppercase tracking-widest px-6 py-3 rounded-xs"
            >
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
