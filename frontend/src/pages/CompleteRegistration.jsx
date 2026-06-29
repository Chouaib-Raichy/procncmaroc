import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import machineBg from '../assets/machineBG.webp';
import SEO from '../components/SEO';

const MAX_IMAGES = 6;

export default function CompleteRegistration() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [bioError, setBioError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user || user.is_approved || user.business_bio) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    const selected = Array.from(files).slice(0, remaining);
    setImages((prev) => [...prev, ...selected]);
    selected.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((prev) => [...prev, url]);
    });
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!bio.trim()) {
      setBioError('Please tell us about your business');
      return;
    }
    setBioError('');
    setSending(true);
    try {
      await api.put('/auth/profile', { business_bio: bio });
      await refreshUser();
      navigate('/pending-approval', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO title="Complete Registration" description="Complete your PRO CNC MAROC business registration to get your account approved." canonicalUrl="/complete-registration" noindex={true} />
      <div style={styles.page}>
      <div style={styles.overlay}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h1 style={styles.title}>Complete Your Registration</h1>
          <p style={styles.subtitle}>Tell us about your business so we can verify your account.</p>

          {error && <p style={styles.error}>{error}</p>}

          <label style={styles.label}>Business Description *</label>
          <textarea
            style={{ ...styles.textarea, borderColor: bioError ? '#ff6b6b' : '#555' }}
            placeholder="Describe your business, what type of machines you use, and any relevant details..."
            value={bio}
            onChange={(e) => { setBio(e.target.value); setBioError(''); }}
            maxLength={2000}
          />
          {bioError && <p style={styles.fieldError}>{bioError}</p>}
          <p style={{ color: '#666', fontSize: '12px', marginTop: '-10px', marginBottom: '16px' }}>{bio.length}/2000</p>

          <label style={styles.label}>Business Images (up to {MAX_IMAGES})</label>
          <div style={styles.imageGrid}>
            {previews.map((url, i) => (
              <div key={i} style={styles.imageWrap}>
                <img src={url} alt={`Business ${i + 1}`} style={styles.thumb} />
                <button type="button" onClick={() => removeImage(i)} style={styles.removeBtn}>✕</button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <div style={styles.addBox} onClick={() => fileRef.current?.click()}>
                <span style={{ fontSize: '32px', color: '#a37a39' }}>+</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Add image</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file" accept="image/*" multiple
            style={{ display: 'none' }}
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
          />

          <button type="submit" style={{ ...styles.btn, opacity: sending ? 0.6 : 1 }} disabled={sending}>
            {sending ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
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
  form: {
    background: 'linear-gradient(#111, #000)',
    padding: 'clamp(28px, 5vw, 44px)',
    borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
    width: 'min(100%, 500px)', border: '1px solid #a37a39',
  },
  title: {
    fontSize: 'clamp(22px, 4vw, 28px)', color: '#d4af37',
    marginBottom: '8px', textAlign: 'center',
  },
  subtitle: {
    color: '#aaa', textAlign: 'center', fontSize: '14px',
    marginBottom: 'clamp(20px, 3vw, 30px)', lineHeight: 1.6,
  },
  label: {
    color: '#d4af37', fontSize: '13px', fontWeight: 600,
    display: 'block', marginBottom: '6px',
  },
  textarea: {
    width: '100%', padding: 'clamp(10px, 1.5vw, 14px)',
    borderRadius: '5px', border: '1px solid #555',
    background: '#222', color: '#fff',
    fontSize: 'clamp(13px, 1.3vw, 14px)',
    boxSizing: 'border-box', outline: 'none',
    height: 'clamp(120px, 18vw, 160px)',
    resize: 'vertical', fontFamily: 'inherit',
    marginBottom: '18px',
  },
  imageGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '10px',
    marginBottom: 'clamp(20px, 3vw, 30px)',
  },
  imageWrap: {
    position: 'relative', width: '100px', height: '100px',
    borderRadius: '8px', overflow: 'hidden', border: '1px solid #444',
  },
  thumb: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  removeBtn: {
    position: 'absolute', top: '4px', right: '4px',
    width: '22px', height: '22px', borderRadius: '50%',
    background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none',
    cursor: 'pointer', fontSize: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', lineHeight: 1,
  },
  addBox: {
    width: '100px', height: '100px', borderRadius: '8px',
    border: '2px dashed #444', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%', background: '#a37a39', color: '#fff',
    border: 'none', padding: 'clamp(12px, 2vw, 14px)',
    borderRadius: '5px', fontSize: 'clamp(14px, 2vw, 16px)',
    fontWeight: '600', cursor: 'pointer',
  },
  error: {
    color: '#ff6b6b', textAlign: 'center', marginBottom: '16px', fontSize: '14px',
  },
  fieldError: {
    color: '#ff6b6b', fontSize: '12px', marginTop: '-12px', marginBottom: '12px',
  },
};
