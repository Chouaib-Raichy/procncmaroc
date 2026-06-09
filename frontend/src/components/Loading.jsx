export default function Loading({ text = 'Loading...' }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.ring}>
          <div style={styles.spinner}></div>
        </div>
        <p style={styles.text}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a, #000, #0a0a0a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    textAlign: 'center',
  },
  ring: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
  },
  spinner: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#d4af37',
    borderRightColor: '#a37a39',
    animation: 'loadingSpin 0.9s linear infinite',
    boxShadow: '0 0 20px rgba(163, 122, 57, 0.15)',
  },
  text: {
    color: '#a37a39',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    animation: 'loadingPulse 1.5s ease-in-out infinite',
  },
};
