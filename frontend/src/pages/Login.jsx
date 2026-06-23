import { useState, useMemo, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import machineBg from '../assets/machineBG.webp';
import SEO from '../components/SEO';

const validators = {
  email: (v) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  },
  password: (v) => {
    if (!v) return 'Password is required';
    if (v.length < 1) return 'Password is required';
    return '';
  },
};

export default function Login() {
  const { user } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.resetSuccess) {
      setResetMsg('Password reset successfully! You can now log in with your new password.');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = (field, value) => {
    const err = validators[field] ? validators[field](value) : '';
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, form[field]);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validate(field, value);
  };

  const allValid = useMemo(() => {
    return Object.keys(validators).every((field) => {
      return form[field] && !validators[field](form[field]);
    });
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setResetMsg('');
    const emailErr = validate('email', form.email);
    const pwErr = validate('password', form.password);
    setTouched({ email: true, password: true });
    if (emailErr || pwErr) return;

    setSending(true);
    try {
      await login(form.email, form.password, remember);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const fieldBorder = (field) => {
    if (!touched[field]) return '#444';
    if (errors[field]) return '#e57373';
    return '#4caf50';
  };

  return (
    <div style={styles.page}>
      <SEO title="Login" description="Log in to your PRO CNC MAROC account to access your orders and services." canonicalUrl="/login" noindex={true} />
      <div style={styles.overlay}>
        <motion.form
          style={styles.form}
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>

          <AnimatePresence>
            {serverError && (
              <motion.div
                style={styles.serverError}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {resetMsg && (
              <motion.div
                style={styles.successMsg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {resetMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <input
                ref={emailRef}
                style={{ ...styles.input, borderColor: fieldBorder('email') }}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                autoComplete="email"
              />
              <AnimatePresence>
                {touched.email && !errors.email && form.email && (
                  <motion.span
                    style={styles.checkIcon}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >✓</motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.p
                  style={styles.fieldError}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >{errors.email}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('password'), paddingRight: '44px' }}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 0 3.5-7 9-7s9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                    <path d="M5 10c0 0 2.5-3 7-3s7 3 7 3" strokeWidth="0.8" opacity="0.35" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="11" cy="11" r="1" fill="#fff" opacity="0.8" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 0 3.5-7 9-7s9 7 9 7-3.5 7-9 7-9-7-9-7z" opacity="0.25" />
                    <path d="M3 12c0 0 3.5 4 9 4s9-4 9-4" strokeWidth="1.6" />
                    <path d="M7 14.5l-1 1.8" strokeWidth="1" />
                    <path d="M10 15.5l-0.6 2" strokeWidth="1" />
                    <path d="M13 16v2" strokeWidth="1" />
                    <path d="M16 15.5l0.6 2" strokeWidth="1" />
                    <path d="M19 14.5l1 1.8" strokeWidth="1" />
                  </svg>
                )}
              </button>
            </div>
            <AnimatePresence>
              {touched.password && errors.password && (
                <motion.p
                  style={styles.fieldError}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >{errors.password}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.rememberRow}>
            <label style={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
          </div>

          <motion.button
            style={{ ...styles.btn, opacity: (!allValid || sending) ? 0.5 : 1 }}
            type="submit"
            disabled={!allValid || sending}
            whileHover={allValid && !sending ? { scale: 1.02 } : {}}
            whileTap={allValid && !sending ? { scale: 0.98 } : {}}
          >
            {sending ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={styles.spinner} />
                Signing in...
              </span>
            ) : 'Sign In'}
          </motion.button>

          <p style={styles.text}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.link}>Create one</Link>
          </p>
        </motion.form>
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
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  form: {
    background: 'linear-gradient(145deg, #111, #000)',
    padding: 'clamp(28px, 5vw, 44px)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    width: 'min(100%, 420px)',
    border: '1px solid #a37a39',
  },
  title: {
    fontSize: 'clamp(24px, 4vw, 30px)',
    color: '#d4af37',
    marginBottom: '4px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: 'clamp(24px, 3vw, 32px)',
  },
  fieldGroup: {
    marginBottom: 'clamp(16px, 2vw, 22px)',
  },
  label: {
    color: '#ccc',
    fontSize: '13px',
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '8px',
    border: '1.5px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 'clamp(14px, 1.5vw, 15px)',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  checkIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#4caf50',
    fontSize: '16px',
    fontWeight: 700,
  },
  togglePassword: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    lineHeight: 1,
    color: '#a37a39',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(18px, 2.5vw, 24px)',
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(18px, 2.5vw, 24px)',
  },
  remember: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#aaa',
    fontSize: 'clamp(13px, 1.3vw, 14px)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    accentColor: '#a37a39',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  forgotLink: {
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    fontWeight: '600',
  },
  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#fff',
    border: 'none',
    padding: 'clamp(13px, 2vw, 15px)',
    borderRadius: '8px',
    fontSize: 'clamp(15px, 2vw, 17px)',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  serverError: {
    background: 'rgba(198,40,40,0.15)',
    border: '1px solid #c62828',
    borderRadius: '6px',
    padding: '10px 14px',
    marginBottom: '16px',
    color: '#ef9a9a',
    fontSize: '13px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  successMsg: {
    background: 'rgba(46,125,50,0.15)',
    border: '1px solid #2e7d32',
    borderRadius: '6px',
    padding: '10px 14px',
    marginBottom: '16px',
    color: '#81c784',
    fontSize: '13px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  fieldError: {
    color: '#e57373',
    fontSize: '12px',
    marginTop: '6px',
    marginLeft: '2px',
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
    marginTop: 'clamp(18px, 2.5vw, 24px)',
    color: '#fff',
    fontSize: 'clamp(13px, 1.5vw, 15px)',
  },
  link: {
    color: '#d4af37',
    textDecoration: 'none',
    fontWeight: '600',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
};
