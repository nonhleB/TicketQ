import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deployment this is where you'd send the error to a logging
    // service (Sentry, LogRocket, etc.) rather than just the console.
    console.error('DeskFlow crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="login-screen">
          <div className="login-card">
            <div className="login-brand">
              <div className="navbar-brand-mark">D</div>
              <span className="navbar-brand-name">DeskFlow</span>
            </div>
            <h1 className="login-title">Something went wrong</h1>
            <p className="login-subtitle">
              An unexpected error occurred. Reloading usually fixes it — if it keeps happening, please contact IT.
            </p>
            <button type="button" className="btn-primary" onClick={this.handleReload}>
              Reload DeskFlow
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
