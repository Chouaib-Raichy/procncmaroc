import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import machineBg from '../assets/machineBG.jpeg';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h1 style={styles.title}>Sign Up</h1>
          {error && <p style={styles.error}>{error}</p>}
          <input style={styles.input} placeholder="Full Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Confirm Password" value={form.password_confirmation} onChange={(e) => setForm({...form, password_confirmation: e.target.value})} required />
          <button style={styles.btn} type="submit">Sign Up</button>
          <div style={styles.divider}><span style={styles.dividerLine}></span><span style={styles.dividerText}>or</span><span style={styles.dividerLine}></span></div>
          <button type="button" style={styles.googleBtn} onClick={googleLogin}>
            <svg style={{width:'18px',height:'18px'}} viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.78l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign up with Google
          </button>
          <p style={styles.text}>
            Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    background: 'linear-gradient(#111, #000)',
    padding: 'clamp(24px, 5vw, 40px)',
    borderRadius: '10px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
    width: 'min(100%, 400px)',
    border: '1px solid #a37a39',
  },
  title: {
    fontSize: 'clamp(22px, 4vw, 28px)',
    color: '#d4af37',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 'clamp(12px, 2vw, 14px)',
    marginBottom: 'clamp(14px, 2vw, 20px)',
    borderRadius: '5px',
    border: '1px solid #555',
    background: '#222',
    color: '#fff',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btn: {
    width: '100%',
    background: '#a37a39',
    color: '#fff',
    border: 'none',
    padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px',
    fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 'clamp(12px, 2vw, 20px)',
    fontSize: '14px',
  },
  text: {
    textAlign: 'center',
    marginTop: 'clamp(14px, 2vw, 20px)',
    color: '#fff',
    fontSize: 'clamp(13px, 1.5vw, 15px)',
  },
  link: {
    color: '#d4af37',
    textDecoration: 'none',
    fontWeight: '600',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: 'clamp(16px, 2vw, 24px) 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#444',
  },
  dividerText: {
    color: '#888',
    fontSize: '13px',
    padding: '0 12px',
  },
  googleBtn: {
    width: '100%',
    background: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px',
    fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};