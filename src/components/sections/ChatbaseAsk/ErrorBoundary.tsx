
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ChatbaseAsk Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <p className="text-gray-600">Chat assistant temporarily unavailable.</p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
