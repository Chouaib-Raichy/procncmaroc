import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

export default function PendingApproval() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.is_approved) return <Navigate to="/" replace />;
  if (!user.business_bio) return <Navigate to="/complete-registration" replace />;

  return (
    <>
      <SEO title="Pending Approval" description="Your PRO CNC MAROC account is under review. You will be notified once approved." canonicalUrl="/pending-approval" noindex={true} />
      <div style={styles.page}>
        <div style={styles.overlay}>
          <div style={styles.card}>
            <div style={styles.icon}>⏳</div>
            <h1 style={styles.title}>Registration Under Review</h1>
            <p style={styles.text}>
              Thank you for submitting your business information! Your account is currently
              being reviewed by our team. This usually takes 1-2 business days.
            </p>
            <p style={styles.text}>
              You will be notified once your account is approved. If you have any questions,
              please contact us at <a href="mailto:contact.procncmaroc@gmail.com" style={styles.link}>contact.procncmaroc@gmail.com</a>.
            </p>
            <div style={styles.divider} />
            <button onClick={logout} style={styles.btn}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: 'calc(100vh - 70px)',
    background: 'rgba(0,0,0,0.65)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  },
  card: {
    background: 'linear-gradient(#111, #000)',
    padding: 'clamp(32px, 5vw, 48px)',
    borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
    width: 'min(100%, 480px)', border: '1px solid #a37a39',
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px', marginBottom: '16px',
  },
  title: {
    fontSize: 'clamp(24px, 4vw, 30px)', color: '#d4af37',
    marginBottom: '20px',
  },
  text: {
    color: '#bbb', fontSize: 'clamp(14px, 1.5vw, 16px)',
    lineHeight: 1.8, marginBottom: '16px',
  },
  link: {
    color: '#d4af37', textDecoration: 'none', fontWeight: 600,
  },
  divider: {
    height: '1px', background: '#333', margin: '24px 0',
  },
  btn: {
    background: '#a37a39', color: '#fff', border: 'none',
    padding: 'clamp(12px, 2vw, 14px) clamp(32px, 4vw, 48px)',
    borderRadius: '6px', fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: 600, cursor: 'pointer',
  },
};
