import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-gray-800/90 border border-gray-700 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              An unexpected interface error occurred. Don't worry, your data and selections are safe.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 rounded-xl bg-gray-950/80 p-3 text-left border border-gray-700/60 font-mono text-[11px] text-rose-400 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
