import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import Loading from '../components/Loading';

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileBg, setProfileBg] = useState(null);
  const [profileBgPreview, setProfileBgPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const avatarRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBusinessLocation(user.business_location || '');
      setCity(user.city || '');
      setCountry(user.country || '');
    }
  }, [user]);

  if (loading) return <Loading text="Loading profile..." />;
  if (!user) return <Navigate to="/login" replace />;

  const handleAvatar = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatar(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleBg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setProfileBg(f);
    setProfileBgPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const fd = new FormData();
      if (name !== user.name) fd.append('name', name);
      if (email !== user.email) fd.append('email', email);
      if (phone !== (user.phone || '')) fd.append('phone', phone);
      if (businessLocation !== (user.business_location || '')) fd.append('business_location', businessLocation);
      if (city !== (user.city || '')) fd.append('city', city);
      if (country !== (user.country || '')) fd.append('country', country);
      if (password) {
        fd.append('password', password);
        fd.append('password_confirmation', passwordConfirmation);
      }
      if (avatar) fd.append('avatar', avatar);
      if (profileBg) fd.append('profile_bg', profileBg);
      const res = await updateProfile(fd);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setPasswordConfirmation('');
      setAvatar(null);
      setProfileBg(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (profileBgPreview) URL.revokeObjectURL(profileBgPreview);
      setAvatarPreview(null);
      setProfileBgPreview(null);
    } catch (err) {
      const data = err.response?.data;
      const msgText = data?.message || Object.values(data?.errors || {}).flat().join(', ') || 'Update failed';
      setMsg({ type: 'error', text: msgText });
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = avatarPreview || user.avatar_url;
  const currentBg = profileBgPreview || user.profile_bg_url;

  return (
    <div style={pageWrap}>
      <div style={container}>
        {/* Cover */}
        <div style={coverWrap}>
          <div style={{ ...cover, backgroundImage: `url(${currentBg || 'https://placehold.co/1200x400/1a1a1a/a37a39?text=PRO+CNC+MAROC'})` }} />
          <div style={coverOverlay} />
          <button style={coverBtn} onClick={() => bgRef.current?.click()} title="Change cover">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input ref={bgRef} type="file" accept="image/*" onChange={handleBg} style={{ display: 'none' }} />
          <div style={avatarWrap}>
            <div style={avatarInner} onClick={() => avatarRef.current?.click()}>
              {currentAvatar ? (
                <img src={currentAvatar} alt="" style={avatarImg} />
              ) : (
                <div style={avatarPlaceholder}>{user.name?.charAt(0).toUpperCase()}</div>
              )}
              <div style={avatarBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Info card */}
        <div style={infoCard}>
          <h1 style={infoName}>{user.name}</h1>
          <p style={infoRole}>{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
          <div style={infoMeta}>
            {user.email && <span style={infoTag}>&#9993; {user.email}</span>}
            {user.phone && <span style={infoTag}>&#9742; {user.phone}</span>}
            {user.city && user.country && <span style={infoTag}>&#127758; {user.city}, {user.country}</span>}
          </div>
        </div>

        {/* Edit form */}
        <div style={formCard}>
          <h2 style={formTitle}>Edit Profile</h2>

          {msg && (
            <div style={{
              padding: '12px 16px', borderRadius: '6px', marginBottom: '20px',
              background: msg.type === 'success' ? '#0d2a0d' : '#2a0d0d',
              border: `1px solid ${msg.type === 'success' ? '#2e7d32' : '#c62828'}`,
              color: msg.type === 'success' ? '#81c784' : '#ef9a9a', fontSize: '14px',
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <div style={formCol}>
                <label style={fieldLabel}>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>Phone</label>
                <PhoneInput value={phone} onChange={(v) => setPhone(v)} style={{ width: '100%' }} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>Business Location</label>
                <input value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} required style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} required style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>New Password (optional)</label>
                <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={fieldInput} />
              </div>
              <div style={formCol}>
                <label style={fieldLabel}>Confirm Password</label>
                <input type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} style={fieldInput} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={saveBtn(saving)}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const pageWrap = {
  minHeight: '100vh',
  background: '#000',
  fontFamily: "Georgia, 'Times New Roman', Times, serif",
};

const container = {
  maxWidth: '860px',
  margin: '0 auto',
  padding: 'clamp(16px, 3vw, 40px)',
};

const coverWrap = {
  position: 'relative',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden',
  height: 'clamp(180px, 25vw, 300px)',
};

const cover = {
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'background-image 0.3s',
};

const coverOverlay = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.7) 100%)',
};

const coverBtn = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  transition: '0.2s',
};

const avatarWrap = {
  position: 'absolute',
  bottom: '-50px',
  left: 'clamp(20px, 4vw, 40px)',
  zIndex: 3,
};

const avatarInner = {
  width: 'clamp(90px, 12vw, 120px)',
  height: 'clamp(90px, 12vw, 120px)',
  borderRadius: '50%',
  border: '4px solid #a37a39',
  overflow: 'hidden',
  cursor: 'pointer',
  position: 'relative',
  background: '#111',
};

const avatarImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const avatarPlaceholder = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #a37a39, #c8952e)',
  color: '#000',
  fontSize: 'clamp(36px, 5vw, 48px)',
  fontWeight: 'bold',
};

const avatarBadge = {
  position: 'absolute',
  bottom: '4px',
  right: '4px',
  background: '#a37a39',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
};

const infoCard = {
  background: 'linear-gradient(145deg, #0d0d0d, #161616)',
  border: '1px solid #2a2a2a',
  borderTop: 'none',
  borderRadius: '0 0 12px 12px',
  padding: 'clamp(60px, 8vw, 70px) clamp(20px, 3vw, 40px) clamp(20px, 3vw, 32px)',
  marginBottom: 'clamp(16px, 2vw, 24px)',
};

const infoName = {
  color: '#d4af37',
  fontSize: 'clamp(22px, 3vw, 28px)',
  fontWeight: '700',
  margin: '0 0 4px',
};

const infoRole = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 14px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const infoMeta = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
};

const infoTag = {
  color: '#aaa',
  fontSize: '13px',
};

const formCard = {
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '12px',
  padding: 'clamp(20px, 3vw, 36px)',
};

const formTitle = {
  color: '#a37a39',
  fontSize: 'clamp(18px, 2.5vw, 22px)',
  fontWeight: '700',
  margin: '0 0 clmap(20px, 3vw, 28px)',
  paddingBottom: '16px',
  borderBottom: '1px solid #222',
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'clamp(14px, 2vw, 20px)',
};

const formCol = {
  marginBottom: '4px',
};

const fieldLabel = {
  color: '#a37a39',
  fontSize: '13px',
  fontWeight: '600',
  display: 'block',
  marginBottom: '6px',
};

const fieldInput = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '6px',
  border: '1px solid #333',
  background: '#111',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const saveBtn = (saving) => ({
  width: '100%',
  padding: '14px',
  marginTop: 'clamp(20px, 3vw, 28px)',
  background: 'linear-gradient(135deg, #a37a39, #d4af37)',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: saving ? 'not-allowed' : 'pointer',
  opacity: saving ? 0.7 : 1,
});
