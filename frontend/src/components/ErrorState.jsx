export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', color: '#888',
    }}>
      <span style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</span>
      <p style={{ color: '#e57373', fontSize: '15px', marginBottom: '8px' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          marginTop: '8px', padding: '8px 24px', background: '#a37a39',
          color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
        }}>
          Try Again
        </button>
      )}
    </div>
  );
}
