import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

const validators = {
  name: (v) => !v.trim() ? 'Full name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
  entreprise_name: (v) => '',
  email: (v) => !v.trim() ? 'Email address is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email address' : '',
  phone: (v) => !v.trim() ? 'Phone number is required' : '',
  business_location: (v) => !v.trim() ? 'Business location is required' : '',
  city: (v) => !v ? 'City is required' : '',
  country: (v) => !v ? 'Country is required' : '',
  password: (v) => !v ? 'Password is required' : v.length < 8 || !/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v) ? 'Must meet all requirements below' : '',
  password_confirmation: (v, form) => !v ? 'Please confirm your password' : v !== form.password ? 'Passwords do not match' : '',
  terms: (v) => !v ? 'You must accept the Terms of Use' : '',
};

const requirements = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', entreprise_name: '', email: '', phone: '', business_location: '', city: '', country: '', password: '', password_confirmation: '', terms: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [countryIndex, setCountryIndex] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  useEffect(() => {
    fetch('/data/cities/_index.json')
      .then((r) => r.json())
      .then((idx) => {
        setCountryIndex(idx);
        setCountryList(Object.keys(idx).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.country || !countryIndex) { setCityList([]); return; }
    setLoadingCities(true);
    const iso = countryIndex[form.country];
    if (!iso) { setLoadingCities(false); setCityList([]); return; }
    fetch(`/data/cities/${iso}.json`)
      .then((r) => r.json())
      .then((cities) => { setCityList(cities); setLoadingCities(false); })
      .catch(() => { setCityList([]); setLoadingCities(false); });
  }, [form.country, countryIndex]);

  const capLocation = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const blur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validators[field](form[field], form);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(validators).forEach((field) => {
      const err = validators[field](form[field], form);
      if (err) errs[field] = err;
    });
    setErrors(errs);
    setTouched(Object.keys(validators).reduce((a, k) => ({ ...a, [k]: true }), {}));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSending(true);
    try {
      await register(form.name, form.entreprise_name, form.email, form.phone, form.business_location, form.city, form.country, form.password, form.password_confirmation, true);
      navigate('/complete-registration');
    } catch (err) {
      const data = err.response?.data;
      const fieldErrs = data?.errors || {};
      setServerErrors(fieldErrs);
      setTouched((prev) => ({ ...prev, ...Object.keys(fieldErrs).reduce((a, k) => ({ ...a, [k]: true }), {}) }));
      setServerError(data?.message || Object.values(fieldErrs).flat().join(', ') || 'Registration failed');
    } finally {
      setSending(false);
    }
  };

  const fieldError = (field) => serverErrors[field]?.[0] || errors[field] || '';

  const allValid = useMemo(() => {
    return Object.keys(validators).every((field) => {
      return validators[field](form[field], form) === '';
    });
  }, [form]);

  const fieldBorder = (field) => {
    if (!touched[field] && !serverErrors[field]) return '#444';
    if (errors[field] || serverErrors[field]) return '#e57373';
    return '#4caf50';
  };

  const pwChecks = requirements.map((r) => ({ ...r, met: r.test(form.password) }));

  return (
    <div style={styles.page}>
      <SEO title="Sign Up" description="Create your PRO CNC MAROC account and join our network of CNC machining professionals in Morocco." canonicalUrl="/signup" noindex={true} />
      <div style={styles.overlay}>
        <motion.form
          style={styles.form}
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join our community of CNC professionals</p>

          <AnimatePresence>
            {serverError && (
              <motion.div
                style={styles.serverError}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >{serverError}</motion.div>
            )}
          </AnimatePresence>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrap}>
              <input
                ref={nameRef}
                style={{ ...styles.input, borderColor: fieldBorder('name') }}
                type="text" placeholder="John Doe"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                onBlur={() => blur('name')}
                autoComplete="name"
              />
              <AnimatePresence>
                {touched.name && !fieldError('name') && form.name && (
                  <motion.span style={styles.checkIcon} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {touched.name && fieldError('name') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('name')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Entreprise Name</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('entreprise_name') }}
                type="text" placeholder="Your company name"
                value={form.entreprise_name}
                onChange={(e) => set('entreprise_name', e.target.value)}
                onBlur={() => blur('entreprise_name')}
                autoComplete="organization"
              />
              <AnimatePresence>
                {touched.entreprise_name && !fieldError('entreprise_name') && form.entreprise_name && (
                  <motion.span style={styles.checkIcon} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {touched.entreprise_name && fieldError('entreprise_name') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('entreprise_name')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('email') }}
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                onBlur={() => blur('email')}
                autoComplete="email"
              />
              <AnimatePresence>
                {touched.email && !fieldError('email') && form.email && (
                  <motion.span style={styles.checkIcon} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {touched.email && fieldError('email') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('email')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone</label>
            <PhoneInput
              value={form.phone}
              onChange={(v) => set('phone', v)}
              onBlur={() => blur('phone')}
              style={{ width: '100%' }}
            />
            <AnimatePresence>
              {touched.phone && fieldError('phone') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('phone')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Business Location</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('business_location') }}
                type="text" placeholder="Paste your business location from Google Maps"
                value={form.business_location}
                onChange={(e) => set('business_location', capLocation(e.target.value))}
                onBlur={() => blur('business_location')}
                autoComplete="country-name"
              />
              <AnimatePresence>
                {touched.business_location && !fieldError('business_location') && form.business_location && (
                  <motion.span style={styles.checkIcon} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {touched.business_location && fieldError('business_location') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('business_location')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Country</label>
            <div style={styles.inputWrap}>
              <select
                style={{ ...styles.input, borderColor: fieldBorder('country'), appearance: 'none', cursor: 'pointer' }}
                value={form.country}
                onChange={(e) => { set('country', e.target.value); set('city', ''); }}
                onBlur={() => blur('country')}
              >
                <option value="">{countryList.length ? 'Select your country' : 'Loading...'}</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <AnimatePresence>
                {touched.country && !fieldError('country') && form.country && (
                  <motion.span style={{ ...styles.checkIcon, right: '32px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
              <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none', fontSize: '12px' }}>▼</span>
            </div>
            <AnimatePresence>
              {touched.country && fieldError('country') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('country')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>City</label>
            <div style={styles.inputWrap}>
              <select
                style={{ ...styles.input, borderColor: fieldBorder('city'), appearance: 'none', cursor: form.country ? 'pointer' : 'not-allowed' }}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                onBlur={() => blur('city')}
                disabled={!form.country || loadingCities}
              >
                <option value="">
                  {loadingCities ? 'Loading cities...' : form.country ? `Select city (${cityList.length})` : 'Select a country first'}
                </option>
                {cityList.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <AnimatePresence>
                {touched.city && !fieldError('city') && form.city && (
                  <motion.span style={{ ...styles.checkIcon, right: '32px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                )}
              </AnimatePresence>
              {form.country && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none', fontSize: '12px' }}>▼</span>}
            </div>
            <AnimatePresence>
              {touched.city && fieldError('city') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('city')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('password'), paddingRight: '44px' }}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                onBlur={() => blur('password')}
                autoComplete="new-password"
              />
              <button
                type="button" style={styles.togglePassword}
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
              {touched.password && fieldError('password') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('password')}</motion.p>
              )}
            </AnimatePresence>
            {(touched.password || form.password) && (
              <motion.div
                style={styles.checklist}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {pwChecks.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 0' }}>
                    <span style={{ color: r.met ? '#4caf50' : '#e57373', fontSize: '12px' }}>{r.met ? '✔' : '✖'}</span>
                    <span style={{ color: r.met ? '#4caf50' : '#aaa', fontSize: '12px' }}>{r.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, borderColor: fieldBorder('password_confirmation'), paddingRight: '44px' }}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.password_confirmation}
                onChange={(e) => set('password_confirmation', e.target.value)}
                onBlur={() => blur('password_confirmation')}
                autoComplete="new-password"
              />
              <button
                type="button" style={styles.togglePassword}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
              >
                {showConfirm ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 0 3.5-7 9-7s9 7 9 7-3.5 7-9 7-9-7-9-7z" opacity="0.25" />
                    <path d="M3 12c0 0 3.5 4 9 4s9-4 9-4" strokeWidth="1.6" />
                    <path d="M7 14.5l-1 1.8" strokeWidth="1" />
                    <path d="M10 15.5l-0.6 2" strokeWidth="1" />
                    <path d="M13 16v2" strokeWidth="1" />
                    <path d="M16 15.5l0.6 2" strokeWidth="1" />
                    <path d="M19 14.5l1 1.8" strokeWidth="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 0 3.5-7 9-7s9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                    <path d="M5 10c0 0 2.5-3 7-3s7 3 7 3" strokeWidth="0.8" opacity="0.35" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="11" cy="11" r="1" fill="#fff" opacity="0.8" />
                  </svg>
                )}
              </button>
            </div>
            <AnimatePresence>
              {touched.password_confirmation && fieldError('password_confirmation') && (
                <motion.p style={styles.fieldError} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{fieldError('password_confirmation')}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.termsWrapper}>
            <label style={styles.termsLabel}>
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, terms: e.target.checked }));
                  setTouched((prev) => ({ ...prev, terms: true }));
                }}
                style={styles.termsCheckbox}
              />
              <span style={styles.termsText}>
                I accept the <Link to="/terms" target="_blank" style={styles.termsLink}>Terms of Use</Link>
              </span>
            </label>
            {touched.terms && fieldError('terms') && (
              <p style={styles.fieldError}>{fieldError('terms')}</p>
            )}
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
                Creating account...
              </span>
            ) : 'Create Account'}
          </motion.button>

          <p style={styles.text}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
    width: 'min(100%, 460px)',
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
    marginBottom: 'clamp(14px, 2vw, 20px)',
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
    marginTop: 'clamp(4px, 1vw, 8px)',
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
  fieldError: {
    color: '#e57373',
    fontSize: '12px',
    marginTop: '6px',
    marginLeft: '2px',
    overflow: 'hidden',
  },
  checklist: {
    marginTop: '8px',
    padding: '8px 10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
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
  termsWrapper: {
    margin: '18px 0 4px',
    overflow: 'hidden',
  },
  termsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  termsCheckbox: {
    width: '18px',
    height: '18px',
    accentColor: '#a37a39',
    cursor: 'pointer',
    flexShrink: 0,
  },
  termsText: {
    color: '#ccc',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  termsLink: {
    color: '#d4af37',
    textDecoration: 'underline',
    fontWeight: 600,
  },
};
