import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
        display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px',
      }}>
        {toasts.map((t) => (
          <div key={t.id} onClick={() => removeToast(t.id)} style={{
            padding: '14px 20px', borderRadius: '8px', color: '#fff',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease-out',
            background: t.type === 'success' ? '#2e7d32' : t.type === 'warning' ? '#e65100' : '#c62828',
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
