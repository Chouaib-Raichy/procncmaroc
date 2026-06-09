import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '300px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: '#aaa',
          padding: '40px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px' }}>⚠</span>
          <h3 style={{ color: '#e57373', marginBottom: '8px' }}>Something went wrong</h3>
          <p style={{ fontSize: '13px', color: '#888', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '16px', padding: '8px 24px', background: '#a37a39',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
            }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
