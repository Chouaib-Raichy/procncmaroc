import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

const requirements = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const validators = {
  password: (v) => {
    if (!v) return 'Password is required';
    const failed = requirements.filter((r) => !r.test(v));
    return failed.length > 0 ? 'Password does not meet all requirements' : '';
  },
  password_confirmation: (v, pw) => (!v ? 'Please confirm your password' : v !== pw ? 'Passwords do not match' : ''),
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [form, setForm] = useState({ email: emailParam, password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (field, values) => {
    const err = validators[field] ? validators[field](values[field], values.password) : '';
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, form);
  };

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) validate(field, next);
    if (field === 'password' && touched.password_confirmation) {
      const cfErr = validators.password_confirmation(next.password_confirmation, value);
      setErrors((prev) => ({ ...prev, password_confirmation: cfErr }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const pwErr = validate('password', form);
    const cfErr = validate('password_confirmation', form);
    setTouched({ password: true, password_confirmation: true });
    if (pwErr || cfErr) return;

    setSending(true);
    try {
      await api.post('/reset-password', {
        token,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      navigate('/login', { state: { resetSuccess: true } });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setSending(false);
    }
  };

  const pwChecks = requirements.map((r) => ({ ...r, met: r.test(form.password) }));

  return (
    <div style={styles.page}>
      <SEO title="Reset Password" description="Reset your PRO CNC MAROC password." canonicalUrl="/reset-password" />
      <div style={styles.overlay}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h1 style={styles.title}>Reset Password</h1>
          {serverError && <p style={styles.error}>{serverError}</p>}

          <div style={{ marginBottom: '18px' }}>
            <label style={styles.label}>Email</label>
            <input
              style={{ ...styles.input, ...styles.inputReadonly }}
              type="email" value={form.email} readOnly
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={styles.label}>New Password</label>
            <input
              style={{
                ...styles.input,
                borderColor: touched.password && errors.password ? '#ff6b6b' : touched.password && !errors.password ? '#4caf50' : '#555',
              }}
              type="password" autoComplete="new-password" value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')} required
            />
            {touched.password && errors.password && <p style={styles.fieldError}>{errors.password}</p>}
            <div style={{ marginTop: '8px' }}>
              {pwChecks.map((r, i) => (
                <div key={i} style={{ color: r.met ? '#4caf50' : '#888', fontSize: '12px', marginBottom: '3px' }}>
                  {r.met ? '✔' : '✖'} {r.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              style={{
                ...styles.input,
                borderColor: touched.password_confirmation && errors.password_confirmation ? '#ff6b6b' : touched.password_confirmation && !errors.password_confirmation ? '#4caf50' : '#555',
              }}
              type="password" autoComplete="new-password" value={form.password_confirmation}
              onChange={(e) => handleChange('password_confirmation', e.target.value)}
              onBlur={() => handleBlur('password_confirmation')} required
            />
            {touched.password_confirmation && errors.password_confirmation && <p style={styles.fieldError}>{errors.password_confirmation}</p>}
          </div>

          <button style={{ ...styles.btn, opacity: sending ? 0.6 : 1 }} type="submit" disabled={sending}>
            {sending ? 'Resetting...' : 'Reset Password'}
          </button>

          <p style={styles.text}>
            <Link to="/login" style={styles.link}>Back to Login</Link>
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
    marginBottom: 'clamp(20px, 3vw, 30px)', textAlign: 'center',
  },
  label: {
    color: '#d4af37', fontSize: '13px', fontWeight: 600,
    display: 'block', marginBottom: '6px',
  },
  input: {
    width: '100%', padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px', border: '1px solid #555',
    background: '#222', color: '#fff',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    boxSizing: 'border-box', outline: 'none',
  },
  inputReadonly: {
    opacity: 0.6, cursor: 'not-allowed', borderColor: '#333',
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
    color: '#ff6b6b', fontSize: '12px', marginTop: '4px',
  },
  text: {
    textAlign: 'center', marginTop: 'clamp(14px, 2vw, 20px)',
    color: '#fff', fontSize: 'clamp(13px, 1.5vw, 15px)',
  },
  link: {
    color: '#d4af37', textDecoration: 'none', fontWeight: '600',
  },
};
