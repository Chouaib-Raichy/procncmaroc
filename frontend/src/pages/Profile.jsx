import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import Loading from '../components/Loading';
import machineBg from '../assets/machineBG.jpeg';

export default function Profile() {
  const { user, loading, updateProfile, refreshUser } = useAuth();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '', business_location: '', city: '', country: '', password: '', password_confirmation: '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileBg, setProfileBg] = useState(null);
  const [profileBgPreview, setProfileBgPreview] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingBg, setSavingBg] = useState(false);
  const [msgInfo, setMsgInfo] = useState(null);
  const [msgPass, setMsgPass] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const modalRef = useRef(null);
  const avatarRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', email: user.email || '', phone: user.phone || '', business_location: user.business_location || '', city: user.city || '', country: user.country || '' }));
  }, [user]);

  if (loading) return <Loading text="Loading profile..." />;
  if (!user) return <Navigate to="/login" replace />;

  const handleAvatarPick = (e) => { const f = e.target.files[0]; if (f) { setAvatar(f); setAvatarPreview(URL.createObjectURL(f)); uploadImage(f, 'avatar'); } };
  const handleBgPick = (e) => { const f = e.target.files[0]; if (f) { setProfileBg(f); setProfileBgPreview(URL.createObjectURL(f)); uploadImage(f, 'profile_bg'); } };

  const uploadImage = async (file, field) => {
    const setSaving = field === 'avatar' ? setSavingAvatar : setSavingBg;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append(field, file);
      await updateProfile(fd);
      refreshUser();
    } catch (err) {
      const d = err.response?.data;
      console.error('Upload failed', d);
    } finally { setSaving(false); }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    setMsgInfo(null);
    try {
      const fd = new FormData();
      if (form.name !== user.name) fd.append('name', form.name);
      if (form.email !== user.email) fd.append('email', form.email);
      if (form.phone !== (user.phone || '')) fd.append('phone', form.phone);
      if (form.business_location !== (user.business_location || '')) fd.append('business_location', form.business_location);
      if (form.city !== (user.city || '')) fd.append('city', form.city);
      if (form.country !== (user.country || '')) fd.append('country', form.country);
      await updateProfile(fd);
      setMsgInfo({ type: 'success', text: 'Profile information updated' });
    } catch (err) {
      const d = err.response?.data;
      setMsgInfo({ type: 'error', text: d?.message || Object.values(d?.errors || {}).flat().join(', ') || 'Update failed' });
    } finally { setSavingInfo(false); }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) { setMsgPass({ type: 'error', text: 'Enter a new password' }); return; }
    if (form.password !== form.password_confirmation) { setMsgPass({ type: 'error', text: 'Passwords do not match' }); return; }
    setSavingPass(true);
    setMsgPass(null);
    try {
      const fd = new FormData();
      fd.append('password', form.password);
      fd.append('password_confirmation', form.password_confirmation);
      await updateProfile(fd);
      setMsgPass({ type: 'success', text: 'Password updated successfully' });
      setForm((p) => ({ ...p, password: '', password_confirmation: '' }));
    } catch (err) {
      const d = err.response?.data;
      setMsgPass({ type: 'error', text: d?.message || Object.values(d?.errors || {}).flat().join(', ') || 'Update failed' });
    } finally { setSavingPass(false); }
  };

  const currentAvatar = avatarPreview || user.avatar_url;
  const currentBg = profileBgPreview || user.profile_bg_url;
  const images = user.business_images_url || [];
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', autoComplete: 'name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { key: 'phone', label: 'Phone', component: 'phone' },
    { key: 'business_location', label: 'Business Location', placeholder: 'Paste from Google Maps', autoComplete: 'country-name' },
    { key: 'city', label: 'City', placeholder: 'Casablanca', autoComplete: 'address-level2' },
    { key: 'country', label: 'Country', placeholder: 'Morocco', autoComplete: 'country-name' },
  ];

  return (
    <div style={s.page}>
      <div style={s.overlay} />

      {/* Sidebar */}
      <motion.div style={s.sidebar} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <div style={s.sidebarLogo}>Settings</div>
        <div style={s.sidebarItem(tab === 'info')} onClick={() => setTab('info')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Edit Profile
        </div>
        <div style={s.sidebarItem(tab === 'security')} onClick={() => setTab('security')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Password & Security
        </div>
      </motion.div>

      <div style={s.container}>

        {/* Cover */}
        <motion.div style={s.cover} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div style={{ ...s.coverBg, backgroundImage: `url(${currentBg || 'https://placehold.co/1200x350/1a1a1a/333?text=+ '})` }} onClick={() => { modalRef.current = 'cover'; setModal('cover'); }}>
            <div style={s.coverOverlay} />
            <input ref={bgRef} type="file" accept="image/*" onChange={handleBgPick} style={{ display: 'none' }} />
          </div>
        </motion.div>

        {/* Profile Header */}
        <motion.div style={s.header} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div style={s.avatarWrap}>
            <div style={{ ...s.avatarInner, position: 'relative' }} onClick={() => { modalRef.current = 'avatar'; setModal('avatar'); }}>
              {currentAvatar ? <img src={currentAvatar} alt="" style={s.avatarImg} /> : <div style={s.avatarPlaceholder}>{user.name?.charAt(0).toUpperCase()}</div>}
              <div style={s.avatarBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              {savingAvatar && <div style={s.avatarSpinner}><span style={s.thumbSpinner} /></div>}
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarPick} style={{ display: 'none' }} />
          </div>
          <div style={s.headerInfo}>
            <h1 style={s.name}>{user.name}</h1>
            <p style={s.role}>{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
          </div>
        </motion.div>

        {/* Quick Info Bar */}
        <motion.div style={s.quickBar} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          {user.email && (
            <div style={s.quickItem}>
              <span style={s.quickIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a37a39" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </span>
              <span style={s.quickText}>{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div style={s.quickItem}>
              <span style={s.quickIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a37a39" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </span>
              <span style={s.quickText}>{user.phone}</span>
            </div>
          )}
          {user.city && user.country && (
            <div style={s.quickItem}>
              <span style={s.quickIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a37a39" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              <span style={s.quickText}>{user.city}, {user.country}</span>
            </div>
          )}
        </motion.div>

        {/* Bio */}
        {user.business_bio && (
          <motion.div style={s.bioCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <div style={s.bioTitle}>About</div>
            <p style={s.bioText}>{user.business_bio}</p>
          </motion.div>
        )}

        {/* Business Gallery Carousel */}
        {images.length > 0 && (
          <motion.div style={s.galleryCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
            <div style={s.galleryTitle}>Business Gallery ({images.length})</div>
            <div style={s.carousel}>
              <AnimatePresence mode="wait">
                <motion.img key={carouselIndex} src={images[carouselIndex]} alt="" style={s.carouselImg}
                  initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.25 }}
                  onClick={() => window.open(images[carouselIndex], '_blank')}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button style={{ ...s.carouselBtn, left: '10px' }} onClick={() => setCarouselIndex((p) => (p - 1 + images.length) % images.length)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button style={{ ...s.carouselBtn, right: '10px' }} onClick={() => setCarouselIndex((p) => (p + 1) % images.length)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={s.dots}>
                {images.map((_, i) => (<button key={i} style={s.dot(i === carouselIndex)} onClick={() => setCarouselIndex(i)} />))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Content */}
        <AnimatePresence mode="wait">
          {tab === 'info' && (
            <motion.div key="info" style={s.settingsCard}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
            >
              <div style={s.settingsTitle}>Edit Profile</div>
              <AnimatePresence>
                {msgInfo && (
                  <motion.div style={{ ...s.msg, background: msgInfo.type === 'success' ? '#0d2a0d' : '#2a0d0d', borderColor: msgInfo.type === 'success' ? '#2e7d32' : '#c62828', color: msgInfo.type === 'success' ? '#81c784' : '#ef9a9a' }}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  >{msgInfo.text}</motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleInfoSubmit}>
                <div style={s.formGrid}>
                  {fields.map((f) => (
                    <div key={f.key} style={s.field}>
                      <label style={s.fieldLabel}>{f.label}</label>
                      {f.component === 'phone' ? (
                        <PhoneInput value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} style={{ width: '100%' }} />
                      ) : (
                        <input type={f.type || 'text'} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} autoComplete={f.autoComplete} style={s.input} />
                      )}
                    </div>
                  ))}
                </div>
                <motion.button type="submit" disabled={savingInfo} style={s.btn(savingInfo)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  {savingInfo ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span style={s.spinner} /> Saving...</span> : 'Save Changes'}
                </motion.button>
              </form>
            </motion.div>
          )}
          {tab === 'security' && (
            <motion.div key="security" style={s.settingsCard}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
            >
              <div style={s.settingsTitle}>Password & Security</div>
              <AnimatePresence>
                {msgPass && (
                  <motion.div style={{ ...s.msg, background: msgPass.type === 'success' ? '#0d2a0d' : '#2a0d0d', borderColor: msgPass.type === 'success' ? '#2e7d32' : '#c62828', color: msgPass.type === 'success' ? '#81c784' : '#ef9a9a' }}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  >{msgPass.text}</motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handlePassSubmit}>
                <div style={s.formGrid}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>New Password</label>
                    <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Enter new password" style={s.input} />
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Confirm Password</label>
                    <input type="password" autoComplete="new-password" value={form.password_confirmation} onChange={(e) => setForm((p) => ({ ...p, password_confirmation: e.target.value }))} placeholder="Confirm new password" style={s.input} />
                  </div>
                </div>
                <motion.button type="submit" disabled={savingPass} style={s.btn(savingPass)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  {savingPass ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span style={s.spinner} /> Saving...</span> : 'Update Password'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div style={s.modal} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} onClick={(e) => e.stopPropagation()}>
              <div style={s.modalTitle}>{modal === 'avatar' ? 'Profile Picture' : 'Cover Photo'}</div>
              <div style={s.modalPreviewWrap}>
                <img src={modal === 'avatar' ? currentAvatar : currentBg} alt="" style={s.modalPreview} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button style={s.modalBtn} onClick={() => { const t = modalRef.current; setModal(null); setTimeout(() => (t === 'avatar' ? avatarRef : bgRef).current?.click(), 100); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                  Upload New
                </button>
                {modal === 'avatar' && currentAvatar && (
                  <button style={s.modalBtn} onClick={() => { window.open(currentAvatar, '_blank'); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    View Full
                  </button>
                )}
              </div>
              <button style={s.modalClose} onClick={() => setModal(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat`, fontFamily: "Georgia, 'Times New Roman', Times, serif", paddingTop: 'clamp(16px, 2vw, 30px)', position: 'relative' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 0 },
  container: { width: '100%', maxWidth: '100%', margin: '0 auto', padding: '0 clamp(16px, 3vw, 40px) 0 clamp(200px, 20vw, 260px)', position: 'relative', zIndex: 1, boxSizing: 'border-box' },

  sidebar: { position: 'fixed', top: 0, left: 0, width: 'clamp(170px, 18vw, 220px)', height: '100vh', background: '#0a0a0a', borderRight: '1px solid #1e1e1e', padding: 'clamp(24px, 3vw, 36px) 12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box' },
  sidebarLogo: { color: '#d4af37', fontSize: '18px', fontWeight: '700', padding: '0 16px 20px', marginBottom: '8px', borderBottom: '1px solid #1e1e1e' },
  sidebarItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: active ? '700' : '500', color: active ? '#000' : '#888', background: active ? 'linear-gradient(135deg, #a37a39, #c8952e)' : 'transparent', transition: 'all 0.2s ease',
  }),

  cover: { borderRadius: '16px', overflow: 'hidden', height: 'clamp(170px, 24vw, 280px)', boxShadow: '0 4px 30px rgba(0,0,0,0.4)', width: '100%' },
  coverBg: { width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', transition: 'background-image 0.5s ease' },
  coverOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.75) 100%)' },

  header: { display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.5vw, 28px)', marginTop: '-50px', padding: '0 clamp(20px, 3vw, 36px)', position: 'relative', zIndex: 2 },
  avatarWrap: { flexShrink: 0 },
  avatarInner: { width: 'clamp(90px, 12vw, 112px)', height: 'clamp(90px, 12vw, 112px)', borderRadius: '50%', border: '3px solid #a37a39', overflow: 'hidden', cursor: 'pointer', background: '#111', boxShadow: '0 0 0 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #a37a39, #c8952e)', color: '#000', fontSize: 'clamp(34px, 5vw, 44px)', fontWeight: 'bold' },
  avatarBadge: { position: 'absolute', bottom: '3px', right: '3px', background: '#a37a39', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  avatarSpinner: { position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  thumbSpinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#a37a39', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' },
  headerInfo: { paddingTop: 'clamp(40px, 6vw, 55px)' },
  name: { color: '#d4af37', fontSize: 'clamp(24px, 3.2vw, 30px)', fontWeight: '700', margin: '0 0 3px', letterSpacing: '-0.3px' },
  role: { color: '#555', fontSize: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px' },

  quickBar: { display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 2vw, 24px)', padding: 'clamp(14px, 2vw, 20px) clamp(20px, 3vw, 36px)', marginTop: '6px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #1a1a1a', borderTop: '1px solid #1a1a1a', alignItems: 'center' },
  quickItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  quickIcon: { display: 'flex', alignItems: 'center', opacity: 0.8 },
  quickText: { color: '#999', fontSize: '13px' },

  bioCard: { margin: 'clamp(14px, 2vw, 20px) clamp(20px, 3vw, 36px)', padding: '18px 22px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '14px' },
  bioTitle: { color: '#a37a39', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' },
  bioText: { color: '#aaa', fontSize: '14px', lineHeight: 1.8, margin: 0 },

  galleryCard: { margin: 'clamp(14px, 2vw, 20px) clamp(20px, 3vw, 36px)', padding: '18px 22px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '14px' },
  galleryTitle: { color: '#a37a39', fontSize: '14px', fontWeight: '700', marginBottom: '14px' },
  carousel: { position: 'relative', borderRadius: '10px', overflow: 'hidden', background: '#111' },
  carouselImg: { width: '100%', height: 'clamp(240px, 38vw, 400px)', objectFit: 'cover', display: 'block', cursor: 'pointer' },
  carouselBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, backdropFilter: 'blur(4px)' },
  dots: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' },
  dot: (active) => ({ width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: active ? '#a37a39' : '#333', transition: 'background 0.2s', padding: 0 }),

  settingsCard: { margin: 'clamp(14px, 2vw, 20px) clamp(20px, 3vw, 36px)', padding: 'clamp(20px, 3vw, 30px)', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '14px' },
  settingsTitle: { color: '#d4af37', fontSize: '17px', fontWeight: '700', marginBottom: '16px' },

  msg: { padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', border: '1px solid', fontSize: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'clamp(14px, 2vw, 20px)' },
  field: { marginBottom: '2px' },
  fieldLabel: { color: '#a37a39', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#111', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  btn: (saving) => ({ width: '100%', padding: '13px', marginTop: 'clamp(18px, 2.5vw, 24px)', background: 'linear-gradient(135deg, #a37a39, #d4af37)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s' }),
  spinner: { width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' },

  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modal: { background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: 'clamp(20px, 3vw, 28px)', maxWidth: '420px', width: '90vw', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' },
  modalTitle: { color: '#d4af37', fontSize: '16px', fontWeight: '700', marginBottom: '14px', textAlign: 'center' },
  modalPreviewWrap: { borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', justifyContent: 'center', maxHeight: '260px' },
  modalPreview: { maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' },
  modalBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
  modalClose: { position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' },
};
