import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ============================================================================
// ROOT ERROR BOUNDARY: Catches everything, even if App.jsx fails to load
// ============================================================================
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("CRITICAL ROOT CRASH:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#071318', color: 'white', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
          <div style={{ backgroundColor: '#0f172a', border: '2px solid #e11d48', borderRadius: '20px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#fb7185', fontSize: '24px', margin: '0 0 10px 0' }}>⚠️ Fatal Application Crash</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '20px' }}>The app failed to load. Please read the exact error below to fix it:</p>
            
            <h3 style={{ color: '#fcd34d', fontSize: '14px', marginBottom: '5px' }}>Error Message:</h3>
            <pre style={{ backgroundColor: '#000', padding: '15px', borderRadius: '10px', color: '#fda4af', overflowX: 'auto', fontSize: '13px' }}>
              {this.state.error?.toString()}
            </pre>

            <h3 style={{ color: '#fcd34d', fontSize: '14px', margin: '15px 0 5px 0' }}>Where it happened (Stack Trace):</h3>
            <pre style={{ backgroundColor: '#000', padding: '15px', borderRadius: '10px', color: '#94a3b8', overflowX: 'auto', fontSize: '11px', lineHeight: '1.5' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);