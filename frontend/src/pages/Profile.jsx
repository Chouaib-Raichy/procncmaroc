import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import Loading from '../components/Loading';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '', business_location: '', city: '', country: '', password: '', password_confirmation: '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileBg, setProfileBg] = useState(null);
  const [profileBgPreview, setProfileBgPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const avatarRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', email: user.email || '', phone: user.phone || '', business_location: user.business_location || '', city: user.city || '', country: user.country || '' }));
  }, [user]);

  if (loading) return <Loading text="Loading profile..." />;
  if (!user) return <Navigate to="/login" replace />;

  const handleAvatar = (e) => { const f = e.target.files[0]; if (f) { setAvatar(f); setAvatarPreview(URL.createObjectURL(f)); } };
  const handleBg = (e) => { const f = e.target.files[0]; if (f) { setProfileBg(f); setProfileBgPreview(URL.createObjectURL(f)); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const fd = new FormData();
      if (form.name !== user.name) fd.append('name', form.name);
      if (form.email !== user.email) fd.append('email', form.email);
      if (form.phone !== (user.phone || '')) fd.append('phone', form.phone);
      if (form.business_location !== (user.business_location || '')) fd.append('business_location', form.business_location);
      if (form.city !== (user.city || '')) fd.append('city', form.city);
      if (form.country !== (user.country || '')) fd.append('country', form.country);
      if (form.password) { fd.append('password', form.password); fd.append('password_confirmation', form.password_confirmation); }
      if (avatar) fd.append('avatar', avatar);
      if (profileBg) fd.append('profile_bg', profileBg);
      await updateProfile(fd);
      setMsg({ type: 'success', text: 'Profile updated successfully' });
      setForm((p) => ({ ...p, password: '', password_confirmation: '' }));
      setAvatar(null); setProfileBg(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (profileBgPreview) URL.revokeObjectURL(profileBgPreview);
      setAvatarPreview(null); setProfileBgPreview(null);
    } catch (err) {
      const d = err.response?.data;
      setMsg({ type: 'error', text: d?.message || Object.values(d?.errors || {}).flat().join(', ') || 'Update failed' });
    } finally { setSaving(false); }
  };

  const currentAvatar = avatarPreview || user.avatar_url;
  const currentBg = profileBgPreview || user.profile_bg_url;
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', autoComplete: 'name' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { key: 'phone', label: 'Phone Number', component: 'phone' },
    { key: 'business_location', label: 'Business Location', placeholder: 'Paste your business location from Google Maps', autoComplete: 'country-name' },
    { key: 'city', label: 'City', placeholder: 'Casablanca', autoComplete: 'address-level2' },
    { key: 'country', label: 'Country', placeholder: 'Morocco', autoComplete: 'country-name' },
  ];

  return (
    <div style={pageWrap}>
      <div style={container}>
        {/* Cover */}
        <motion.div style={coverWrap} {...fadeUp} transition={{ duration: 0.5 }}>
          <div style={{ ...cover, backgroundImage: `url(${currentBg || 'https://placehold.co/1200x400/1a1a1a/333?text=+ '})` }} />
          <div style={coverOverlay} />
          <motion.button style={coverBtn} onClick={() => bgRef.current?.click()} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </motion.button>
          <input ref={bgRef} type="file" accept="image/*" onChange={handleBg} style={{ display: 'none' }} />
          <div style={avatarWrap}>
            <motion.div style={avatarInner} onClick={() => avatarRef.current?.click()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {currentAvatar ? (
                <img src={currentAvatar} alt="" style={avatarImg} />
              ) : (
                <div style={avatarPlaceholder}>{user.name?.charAt(0).toUpperCase()}</div>
              )}
              <div style={avatarBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </motion.div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div style={infoCard} {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
          <h1 style={infoName}>{user.name}</h1>
          <p style={infoRole}>{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
          <div style={infoMeta}>
            {user.email && <span style={infoTag}>&#9993; {user.email}</span>}
            {user.phone && <span style={infoTag}>&#9742; {user.phone}</span>}
            {user.city && user.country && <span style={infoTag}>&#127758; {user.city}, {user.country}</span>}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div style={tabBar} {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          {['info', 'security'].map((t) => (
            <button key={t} style={tabItem(t === tab)} onClick={() => setTab(t)}>
              {t === 'info' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              {t === 'info' ? 'Profile Information' : 'Security'}
            </button>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div style={formCard} {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
          <AnimatePresence>
            {msg && (
              <motion.div
                style={{ ...msgBox, background: msg.type === 'success' ? '#0d2a0d' : '#2a0d0d', borderColor: msg.type === 'success' ? '#2e7d32' : '#c62828', color: msg.type === 'success' ? '#81c784' : '#ef9a9a' }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <span style={{ marginRight: '8px', fontSize: '16px' }}>{msg.type === 'success' ? '✓' : '✕'}</span>
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {tab === 'info' && (
              <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={formGrid}>
                  {fields.map((f) => (
                    <div key={f.key} style={fieldWrap}>
                      <label style={fieldLabel}>{f.label}</label>
                      {f.component === 'phone' ? (
                        <PhoneInput value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} style={{ width: '100%' }} />
                      ) : (
                        <input
                          type={f.type || 'text'}
                          value={form[f.key]}
                          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          autoComplete={f.autoComplete}
                          style={fieldInput}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={formGrid}>
                  <div style={fieldWrap}>
                    <label style={fieldLabel}>New Password</label>
                    <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Leave blank to keep current" style={fieldInput} />
                  </div>
                  <div style={fieldWrap}>
                    <label style={fieldLabel}>Confirm Password</label>
                    <input type="password" autoComplete="new-password" value={form.password_confirmation} onChange={(e) => setForm((p) => ({ ...p, password_confirmation: e.target.value }))} placeholder="Re-enter new password" style={fieldInput} />
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit" disabled={saving}
              style={saveBtn(saving)}
              whileHover={!saving ? { scale: 1.01 } : {}}
              whileTap={!saving ? { scale: 0.99 } : {}}
            >
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={spinner} /> Saving...
                </span>
              ) : 'Save Changes'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const pageWrap = {
  minHeight: '100vh', background: '#000',
  fontFamily: "Georgia, 'Times New Roman', Times, serif",
};
const container = {
  maxWidth: '860px', margin: '0 auto',
  padding: 'clamp(16px, 3vw, 40px)',
};
const coverWrap = {
  position: 'relative', borderRadius: '16px 16px 0 0', overflow: 'hidden',
  height: 'clamp(180px, 25vw, 300px)',
};
const cover = {
  width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center',
  transition: 'background-image 0.5s ease',
};
const coverOverlay = {
  position: 'absolute', inset: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)',
};
const coverBtn = {
  position: 'absolute', top: '14px', right: '14px',
  background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', borderRadius: '10px', padding: '9px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  backdropFilter: 'blur(6px)',
};
const avatarWrap = {
  position: 'absolute', bottom: '-52px', left: 'clamp(20px, 4vw, 40px)', zIndex: 3,
};
const avatarInner = {
  width: 'clamp(96px, 13vw, 128px)', height: 'clamp(96px, 13vw, 128px)',
  borderRadius: '50%', border: '4px solid #a37a39', overflow: 'hidden',
  cursor: 'pointer', position: 'relative', background: '#111',
  boxShadow: '0 0 0 2px rgba(163,122,57,0.3), 0 8px 32px rgba(0,0,0,0.5)',
};
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };
const avatarPlaceholder = {
  width: '100%', height: '100%', display: 'flex', alignItems: 'center',
  justifyContent: 'center', background: 'linear-gradient(135deg, #a37a39, #c8952e)',
  color: '#000', fontSize: 'clamp(38px, 5vw, 52px)', fontWeight: 'bold',
};
const avatarBadge = {
  position: 'absolute', bottom: '4px', right: '4px',
  background: '#a37a39', borderRadius: '50%',
  width: '30px', height: '30px', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
};
const infoCard = {
  background: 'linear-gradient(145deg, #0d0d0d, #161616)',
  border: '1px solid #2a2a2a', borderTop: 'none',
  borderRadius: '0 0 12px 12px',
  padding: 'clamp(60px, 8vw, 72px) clamp(20px, 3vw, 40px) clamp(18px, 2.5vw, 28px)',
  marginBottom: 'clamp(16px, 2vw, 24px)',
};
const infoName = { color: '#d4af37', fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: '700', margin: '0 0 4px' };
const infoRole = { color: '#555', fontSize: '13px', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1.5px' };
const infoMeta = { display: 'flex', flexWrap: 'wrap', gap: '16px' };
const infoTag = { color: '#999', fontSize: '13px' };
const tabBar = {
  display: 'flex', gap: '4px', marginBottom: 'clamp(16px, 2vw, 24px)',
  background: '#0a0a0a', borderRadius: '10px', padding: '4px',
  border: '1px solid #222',
};
const tabItem = (active) => ({
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '12px 16px', border: 'none', borderRadius: '8px',
  cursor: 'pointer', fontSize: '14px', fontWeight: active ? '700' : '500',
  background: active ? 'linear-gradient(135deg, #a37a39, #c8952e)' : 'transparent',
  color: active ? '#000' : '#888',
  transition: 'all 0.25s ease',
});
const formCard = {
  background: '#0a0a0a', border: '1px solid #2a2a2a',
  borderRadius: '12px', padding: 'clamp(20px, 3vw, 36px)',
};
const msgBox = {
  padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
  border: '1px solid', fontSize: '14px', display: 'flex', alignItems: 'center',
};
const formGrid = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'clamp(14px, 2vw, 20px)',
};
const fieldWrap = { marginBottom: '4px' };
const fieldLabel = { color: '#a37a39', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' };
const fieldInput = {
  width: '100%', padding: '12px 14px', borderRadius: '8px',
  border: '1px solid #333', background: '#111', color: '#fff',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
const saveBtn = (saving) => ({
  width: '100%', padding: '14px',
  marginTop: 'clamp(20px, 3vw, 28px)',
  background: 'linear-gradient(135deg, #a37a39, #d4af37)',
  color: '#fff', border: 'none', borderRadius: '8px',
  fontSize: '16px', fontWeight: '700',
  cursor: saving ? 'not-allowed' : 'pointer',
  opacity: saving ? 0.7 : 1,
  transition: 'opacity 0.2s',
});
const spinner = {
  width: '18px', height: '18px',
  border: '2px solid rgba(255,255,255,0.3)',
  borderTopColor: '#fff', borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
  display: 'inline-block',
};
