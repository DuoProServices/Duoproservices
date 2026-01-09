import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Save error to sessionStorage so we can display it
    try {
      const errorMessage = error.message || 'Unknown error';
      const componentStack = errorInfo.componentStack || '';
      sessionStorage.setItem("app-error", `${errorMessage}\n\n${componentStack}`);
    } catch (e) {
      // Silently fail if sessionStorage is not available
      console.warn("Failed to save error to sessionStorage:", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Algo deu errado!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              A página encontrou um erro. Tente recarregar!
            </p>

            {this.state.errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-red-800 font-mono break-all">
                  {this.state.errorMessage}
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.href = "/"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🏠 Voltar para Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}