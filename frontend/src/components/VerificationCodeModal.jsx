import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function VerificationCodeModal({ email, onVerified, onClose }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const sentRef = useRef(false);

  const sendCode = useCallback(async () => {
    if (sentRef.current) return;
    sentRef.current = true;
    setSending(true);
    setError(null);
    setTimer(600);
    setCanResend(false);
    try {
      await api.post('/profile/send-code');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code');
    } finally {
      setSending(false);
    }
  }, []);

  useEffect(() => { sendCode(); }, [sendCode]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError(null);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKey = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    setError(null);
    const focusIdx = Math.min(text.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleSubmit = async () => {
    const code = digits.join('');
    if (code.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true);
    setError(null);
    try {
      await onVerified(code);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div style={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div style={s.modal} initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }} onClick={(e) => e.stopPropagation()}>
        <div style={s.iconWrap}>
          <LockIcon />
        </div>
        <h2 style={s.title}>Verify Your Identity</h2>
        <p style={s.subtitle}>
          We sent a 6-digit verification code to <strong style={{ color: '#d4af37' }}>{email}</strong>
        </p>

        {sending && (
          <div style={s.sendingWrap}>
            <span style={s.spinner} />
            <span style={{ color: '#888', fontSize: '14px' }}>Sending code...</span>
          </div>
        )}

        {!sending && (
          <>
            <div style={s.digitRow}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  style={s.digitInput(error && !d)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  autoFocus={i === 0}
                  disabled={loading}
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p style={s.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              style={s.btn(loading)}
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={s.spinner} /> Verifying...
                </span>
              ) : 'Verify & Save Changes'}
            </motion.button>

            <div style={s.timerRow}>
              {canResend ? (
                <motion.button
                  style={s.resendBtn}
                  onClick={() => { sentRef.current = false; sendCode(); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Resend Code
                </motion.button>
              ) : (
                <span style={s.timer}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  Code expires in {formatTime(timer)}
                </span>
              )}
            </div>
          </>
        )}

        <button style={s.closeBtn} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px',
    padding: 'clamp(24px, 4vw, 36px)', maxWidth: '440px', width: '90vw',
    position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  iconWrap: {
    width: '52px', height: '52px', borderRadius: '50%',
    background: 'rgba(163,122,57,0.12)', border: '1px solid rgba(163,122,57,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: { color: '#d4af37', fontSize: '18px', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.2px' },
  subtitle: { color: '#999', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 },
  sendingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '32px 0' },
  digitRow: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
  digitInput: (hasError) => ({
    width: '50px', height: '56px', textAlign: 'center', fontSize: '24px', fontWeight: 700,
    color: '#fff', background: '#0d0d0d',
    border: `2px solid ${hasError ? '#c62828' : '#2a2a2a'}`,
    borderRadius: '12px', outline: 'none', caretColor: '#d4af37',
    transition: 'border-color 0.2s',
  }),
  error: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    color: '#ef9a9a', fontSize: '13px', margin: '0 0 16px',
    padding: '10px 14px', background: 'rgba(198,40,40,0.1)',
    border: '1px solid rgba(198,40,40,0.3)', borderRadius: '8px',
    textAlign: 'left',
  },
  btn: (loading) => ({
    width: '100%', padding: '13px', marginBottom: '16px',
    background: loading ? '#555' : 'linear-gradient(135deg, #a37a39, #d4af37)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
  }),
  spinner: {
    width: '18px', height: '18px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
  timerRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '36px' },
  timer: { display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' },
  resendBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', color: '#d4af37',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    padding: '6px 12px', borderRadius: '8px',
  },
  closeBtn: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'none', border: 'none', color: '#666',
    cursor: 'pointer', padding: '4px',
  },
};
