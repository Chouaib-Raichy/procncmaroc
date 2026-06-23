import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import machineBg from '../assets/machineBG.webp';
import SEO from '../components/SEO';

const validators = {
  email: (v) => (!v ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email format' : ''),
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (field, value) => {
    const err = validators[field] ? validators[field](value) : '';
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') validate('email', email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const emailErr = validate('email', email);
    setTouched({ email: true });
    if (emailErr) return;

    setSending(true);
    try {
      await api.post('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={styles.page}>
        <SEO title="Forgot Password" description="If an account exists with that email, a reset link has been sent." noindex={true} />
        <div style={styles.overlay}>
          <div style={styles.form}>
            <h1 style={styles.title}>Check Your Email</h1>
            <p style={{ color: '#81c784', textAlign: 'center', fontSize: '15px', lineHeight: 1.7 }}>
              If an account exists with that email, we've sent a password reset link.
            </p>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={styles.link}>Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <SEO title="Forgot Password" description="Enter your email address to receive a password reset link." canonicalUrl="/forgot-password" noindex={true} />
      <div style={styles.overlay}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h1 style={styles.title}>Forgot Password</h1>
          <p style={{ color: '#aaa', textAlign: 'center', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          {serverError && <p style={styles.error}>{serverError}</p>}
          <div style={{ marginBottom: '20px' }}>
            <input
              style={{
                ...styles.input,
                borderColor: touched.email && errors.email ? '#ff6b6b' : touched.email && !errors.email ? '#4caf50' : '#555',
              }}
              type="email" placeholder="Email" value={email}
              onChange={(e) => { setEmail(e.target.value); if (touched.email) validate('email', e.target.value); }}
              onBlur={() => handleBlur('email')} required
            />
            {touched.email && errors.email && <p style={styles.fieldError}>{errors.email}</p>}
          </div>
          <button style={{ ...styles.btn, opacity: sending ? 0.6 : 1 }} type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p style={styles.text}>
            Remember your password? <Link to="/login" style={styles.link}>Login</Link>
          </p>
        </form>
      </div>
    </div>
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
  form: {
    background: 'linear-gradient(#111, #000)',
    padding: 'clamp(24px, 5vw, 40px)',
    borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
    width: 'min(100%, 400px)', border: '1px solid #a37a39',
  },
  title: {
    fontSize: 'clamp(22px, 4vw, 28px)', color: '#d4af37',
    marginBottom: 'clamp(16px, 3vw, 24px)', textAlign: 'center',
  },
  input: {
    width: '100%', padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px', border: '1px solid #555',
    background: '#222', color: '#fff',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    boxSizing: 'border-box', outline: 'none',
  },
  btn: {
    width: '100%', background: '#a37a39', color: '#fff',
    border: 'none', padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px', fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: '600', cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b', textAlign: 'center', marginBottom: 'clamp(12px, 2vw, 20px)', fontSize: '14px',
  },
  fieldError: {
    color: '#ff6b6b', fontSize: '12px', marginTop: '6px', marginLeft: '2px',
  },
  text: {
    textAlign: 'center', marginTop: 'clamp(14px, 2vw, 20px)',
    color: '#fff', fontSize: 'clamp(13px, 1.5vw, 15px)',
  },
  link: {
    color: '#d4af37', textDecoration: 'none', fontWeight: '600',
  },
};
