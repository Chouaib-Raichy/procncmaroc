import { Link } from 'react-router-dom';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div style={styles.page}>
      <SEO title="Page Not Found" description="The page you are looking for does not exist or has been moved." noindex={true} />
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.code}>404</h1>
          <h2 style={styles.title}>Page Not Found</h2>
          <p style={styles.text}>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" style={styles.btn}>Go Home</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: 'calc(100vh - 70px)',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'linear-gradient(#111, #000)',
    border: '1px solid #a37a39',
    borderRadius: '10px',
    padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
    textAlign: 'center',
    maxWidth: '480px',
    width: '100%',
  },
  code: {
    fontSize: 'clamp(72px, 12vw, 120px)',
    color: '#d4af37',
    margin: 0,
    lineHeight: 1,
    fontWeight: 700,
  },
  title: {
    fontSize: 'clamp(20px, 3vw, 28px)',
    color: '#fff',
    margin: 'clamp(10px, 2vw, 20px) 0',
  },
  text: {
    fontSize: 'clamp(14px, 1.8vw, 16px)',
    color: '#999',
    marginBottom: 'clamp(24px, 3vw, 36px)',
    lineHeight: 1.6,
  },
  btn: {
    display: 'inline-block',
    background: '#a37a39',
    color: '#fff',
    textDecoration: 'none',
    padding: 'clamp(10px, 1.5vw, 14px) clamp(24px, 4vw, 36px)',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    border: 'none',
    cursor: 'pointer',
  },
};
