import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.jsx';

window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:40px;text-align:center;font-family:Georgia,serif;background:#000;color:#aaa;">
      <span style="font-size:48px;margin-bottom:16px;">⚠</span>
      <h3 style="color:#e57373;margin-bottom:8px;">Something went wrong</h3>
      <p style="font-size:13px;color:#888;max-width:400px;">${e.message || 'An unexpected error occurred'}</p>
      <p style="font-size:11px;color:#555;max-width:500px;word-break:break-all;margin-top:8px;">${e.filename || ''}:${e.lineno || ''}</p>
      <button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;background:#a37a39;color:#fff;border:none;border-radius:6px;cursor:pointer;">Try Again</button>
    </div>`;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
