import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PhoneInput from '../components/PhoneInput';
import VerificationCodeModal from '../components/VerificationCodeModal';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/></svg>
);

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } });

export default function Profile() {
  const { user, loading, updateProfile, refreshUser } = useAuth();
  const [settingsModal, setSettingsModal] = useState(null);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
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
  const [verifyModal, setVerifyModal] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [countryIndex, setCountryIndex] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const modalRef = useRef(null);
  const avatarRef = useRef(null);
  const bgRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    if (!settingsDropdown) return;
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setSettingsDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsDropdown]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', email: user.email || '', phone: user.phone || '', business_location: user.business_location || '', city: user.city || '', country: user.country || '' }));
  }, [user]);

  if (loading) return (
    <div style={s.page}>
      <div style={s.overlay} />
      <div style={s.card}>
        <div style={{ ...s.cover, background: '#111' }} />
        <div style={{ padding: '0 clamp(20px, 5vw, 60px)' }}>
          <div style={{ width: '110px', height: '110px', borderRadius: '50%', marginTop: '-55px', marginBottom: '16px', background: '#1a1a1a', border: '3px solid #222' }} />
          <div style={{ width: 'clamp(140px, 20vw, 220px)', height: '22px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '8px' }} />
          <div style={{ width: 'clamp(100px, 15vw, 160px)', height: '14px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ flex: '1 1 160px', height: '70px', borderRadius: '12px', background: '#1a1a1a' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 40px)', paddingBottom: '40px' }}>
            <div style={{ flex: '1 1 50%' }}><div style={{ width: '100%', height: 'clamp(100px, 14vw, 160px)', borderRadius: '12px', background: '#1a1a1a' }} /></div>
            <div style={{ flex: '1 1 40%' }}><div style={{ width: '100%', height: 'clamp(220px, 30vw, 420px)', borderRadius: '12px', background: '#1a1a1a' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
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
    } catch {} finally { setSaving(false); }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const changes = {};
    if (form.name !== user.name) changes.name = form.name;
    if (form.email !== user.email) changes.email = form.email;
    if (form.phone !== (user.phone || '')) changes.phone = form.phone;
    if (form.business_location !== (user.business_location || '')) changes.business_location = form.business_location;
    if (form.city !== (user.city || '')) changes.city = form.city;
    if (form.country !== (user.country || '')) changes.country = form.country;
    if (Object.keys(changes).length === 0) { setMsgInfo({ type: 'info', text: 'No changes to save' }); return; }
    setPendingChanges(changes);
    setVerifyModal('info');
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) { setMsgPass({ type: 'error', text: 'Enter a new password' }); return; }
    if (form.password !== form.password_confirmation) { setMsgPass({ type: 'error', text: 'Passwords do not match' }); return; }
    setPendingChanges({ password: form.password, password_confirmation: form.password_confirmation });
    setVerifyModal('security');
  };

  const handleVerified = async (code) => {
    const body = { code, ...pendingChanges };
    await api.post('/profile/update-verified', body);
    refreshUser();
    setVerifyModal(null);
    setPendingChanges(null);
    if (body.password) {
      setForm((p) => ({ ...p, password: '', password_confirmation: '' }));
      setMsgPass({ type: 'success', text: 'Password updated successfully' });
    } else {
      setMsgInfo({ type: 'success', text: 'Profile information updated' });
    }
  };

  const currentAvatar = avatarPreview || user.avatar_url;
  const currentBg = profileBgPreview || user.profile_bg_url;
  const images = user.business_images_url || [];
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
  const roleLabel = user.role === 'admin' ? 'Administrator' : 'Member';

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', autoComplete: 'name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { key: 'phone', label: 'Phone', component: 'phone' },
    { key: 'business_location', label: 'Business Location', placeholder: 'Google Maps link or address', autoComplete: 'country-name' },
  ];

  return (
    <>
      <SEO title="My Profile" description="Edit your PRO CNC MAROC profile, manage your business information, and update your gallery." canonicalUrl="/profile" />
      <div style={s.page}>
      <div style={s.overlay} />

      <div style={s.card}>
        {/* Cover */}
        <motion.div style={s.cover} {...fadeUp()}>
          <div style={{ ...s.coverBg, backgroundImage: `url(${currentBg || machineBg})` }} onClick={() => { modalRef.current = 'cover'; setModal('cover'); }}>
            <div style={s.coverGradient} />
            <div style={s.coverContent}>
              <div style={s.avatarWrap}>
                <div style={s.avatarInner} onClick={(e) => { e.stopPropagation(); modalRef.current = 'avatar'; setModal('avatar'); }}>
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
              <div style={s.identityInfo}>
                <h1 style={s.name}>{user.name}</h1>
                <div style={s.roleRow}>
                  {user.entreprise_name && <span style={s.entreprise}>{user.entreprise_name}</span>}
                  <span style={s.roleBadge}>{roleLabel}</span>
                </div>
                <div style={s.coverMeta}>
                  {user.email && (
                    <span style={s.coverMetaItem}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                      {user.email}
                    </span>
                  )}
                  {user.phone && (
                    <span style={s.coverMetaItem}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <input ref={bgRef} type="file" accept="image/*" onChange={handleBgPick} style={{ display: 'none' }} />
            {/* Settings dropdown */}
            <div ref={dropdownRef} style={{ position: 'absolute', top: '16px', right: 'clamp(16px, 3vw, 28px)', zIndex: 5 }}>
              <motion.button
                style={s.settingsBtn}
                onClick={(e) => { e.stopPropagation(); setSettingsDropdown(!settingsDropdown); }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </motion.button>
              <AnimatePresence>
                {settingsDropdown && (
                  <motion.div
                    style={s.dropdown}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.button style={s.dropdownItem} onClick={(e) => { e.stopPropagation(); setSettingsModal('info'); setSettingsDropdown(false); }} whileHover={{ background: 'rgba(163,122,57,0.1)' }} whileTap={{ scale: 0.98 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      Edit Profile
                    </motion.button>
                    <motion.button style={s.dropdownItem} onClick={(e) => { e.stopPropagation(); setSettingsModal('security'); setSettingsDropdown(false); }} whileHover={{ background: 'rgba(163,122,57,0.1)' }} whileTap={{ scale: 0.98 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Password & Security
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div style={s.statsBar} {...fadeUp(0.15)}>
          {user.city && user.country && (
            <div style={s.statCard}>
              <div style={s.statIcon}><LocationIcon /></div>
              <div>
                <div style={s.statValue}>{user.city}, {user.country}</div>
                <div style={s.statLabel}>Location</div>
              </div>
            </div>
          )}
          {memberSince && (
            <div style={s.statCard}>
              <div style={s.statIcon}><CalendarIcon /></div>
              <div>
                <div style={s.statValue}>{memberSince}</div>
                <div style={s.statLabel}>Member Since</div>
              </div>
            </div>
          )}
          {user.business_location && (
            <div style={s.statCard}>
              <div style={s.statIcon}><BuildingIcon /></div>
              <div>
                <div style={s.statValue}>{user.business_location}</div>
                <div style={s.statLabel}>Business</div>
              </div>
            </div>
          )}
        </motion.div>

        <div style={s.divider} />

        {/* Content: About + Gallery */}
        <div style={s.contentArea}>
          <motion.div style={s.leftCol} {...fadeUp(0.2)}>
            {user.business_bio && (
              <div style={s.bioBox}>
                <div style={s.bioLabel}>About</div>
                <p style={s.bioText}>{user.business_bio}</p>
              </div>
            )}

          </motion.div>

          <motion.div style={s.rightCol} {...fadeUp(0.25)}>
            <div style={s.galleryHeader}>
              <div style={s.galleryLine} />
              <span style={s.galleryTitle}>Business Gallery {images.length > 0 ? `(${images.length})` : ''}</span>
              <div style={s.galleryLine} />
            </div>
            {images.length > 0 ? (
              <div style={s.carousel}>
                <AnimatePresence mode="wait">
                  <motion.img key={carouselIndex} src={images[carouselIndex]} alt="" style={s.carouselImg}
                    initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
                    onClick={() => window.open(images[carouselIndex], '_blank')}
                  />
                </AnimatePresence>
                <div style={s.carouselGradientLeft} />
                <div style={s.carouselGradientRight} />
                <span style={s.carouselCounter}>{carouselIndex + 1} / {images.length}</span>
                {images.length > 1 && (
                  <>
                    <button style={{ ...s.carouselBtn, left: '8px' }} onClick={() => setCarouselIndex((p) => (p - 1 + images.length) % images.length)} aria-label="Previous">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button style={{ ...s.carouselBtn, right: '8px' }} onClick={() => setCarouselIndex((p) => (p + 1) % images.length)} aria-label="Next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <div style={s.dots}>
                      {images.map((_, i) => (<button key={i} style={s.dot(i === carouselIndex)} onClick={() => setCarouselIndex(i)} />))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={s.noImages}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ color: '#666', marginTop: '12px', fontSize: '14px' }}>No gallery images yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Settings Modals */}
      <AnimatePresence>
        {settingsModal && (
          <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingsModal(null)}>
            <motion.div style={s.modal} initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }} onClick={(e) => e.stopPropagation()}>
              {settingsModal === 'info' && (
                <>
                  <div style={s.modalTitleBar}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Edit Profile
                  </div>
                  <AnimatePresence>
                    {msgInfo && (
                      <motion.div style={{ ...s.msg, background: msgInfo.type === 'success' ? '#0d2a0d' : msgInfo.type === 'info' ? '#0a1a2a' : '#2a0d0d', borderColor: msgInfo.type === 'success' ? '#2e7d32' : msgInfo.type === 'info' ? '#1565c0' : '#c62828', color: msgInfo.type === 'success' ? '#81c784' : msgInfo.type === 'info' ? '#90caf9' : '#ef9a9a' }}
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
                      <div style={s.field}>
                        <label style={s.fieldLabel}>Country</label>
                        <div style={s.selectWrap}>
                          <select style={s.select} value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value, city: '' }))}>
                            <option value="">{countryList.length ? 'Select your country' : 'Loading...'}</option>
                            {countryList.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <svg style={s.selectArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                      <div style={s.field}>
                        <label style={s.fieldLabel}>City</label>
                        <div style={s.selectWrap}>
                          <select style={{ ...s.select, opacity: !form.country || loadingCities ? 0.5 : 1, cursor: !form.country || loadingCities ? 'not-allowed' : 'pointer' }} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} disabled={!form.country || loadingCities}>
                            <option value="">{loadingCities ? 'Loading cities...' : form.country ? `Select city (${cityList.length})` : 'Select a country first'}</option>
                            {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
                          </select>
                          <svg style={{ ...s.selectArrow, opacity: !form.country || loadingCities ? 0.3 : 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                    </div>
                    <motion.button type="submit" disabled={savingInfo} style={s.btn(savingInfo)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      {savingInfo ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span style={s.spinner} /> Saving...</span> : 'Save Changes'}
                    </motion.button>
                  </form>
                </>
              )}
              {settingsModal === 'security' && (
                <>
                  <div style={s.modalTitleBar}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Password & Security
                  </div>
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
                </>
              )}
              <button style={s.modalClose} onClick={() => setSettingsModal(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Code Modal */}
      <AnimatePresence>
        {verifyModal && (
          <VerificationCodeModal
            email={user.email}
            onVerified={handleVerified}
            onClose={() => { setVerifyModal(null); setPendingChanges(null); }}
          />
        )}
      </AnimatePresence>

      {/* Image Preview Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div style={s.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div style={{ ...s.modal, maxWidth: '420px' }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}

const s = {
  page: { minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat`, position: 'relative' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 0 },

  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(10,10,10,0.95)',
    minHeight: '100vh',
  },

  cover: { height: 'clamp(200px, 30vw, 340px)', position: 'relative' },
  coverBg: { width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', cursor: 'pointer' },
  coverGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.85) 100%)' },
  coverContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(20px, 5vw, 60px) clamp(20px, 3vw, 36px)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(16px, 2.5vw, 28px)' },
  avatarWrap: { flexShrink: 0 },
  avatarInner: {
    width: 'clamp(88px, 10vw, 112px)', height: 'clamp(88px, 10vw, 112px)',
    borderRadius: '50%', border: '3px solid #d4af37', overflow: 'hidden', cursor: 'pointer',
    background: '#111', boxShadow: '0 0 0 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)', position: 'relative',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #a37a39, #c8952e)', color: '#000', fontSize: 'clamp(34px, 5vw, 44px)', fontWeight: 'bold' },
  avatarBadge: { position: 'absolute', bottom: '3px', right: '3px', background: '#d4af37', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  avatarSpinner: { position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  thumbSpinner: { width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' },
  identityInfo: { paddingBottom: '4px', flex: 1 },
  name: { color: '#fff', fontSize: 'clamp(22px, 2.8vw, 28px)', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.3px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  roleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' },
  entreprise: { color: '#ccc', fontSize: '14px', fontWeight: 500 },
  roleBadge: { display: 'inline-block', color: '#d4af37', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', padding: '3px 10px', borderRadius: '4px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' },
  coverMeta: { display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px, 1.5vw, 18px)' },
  coverMetaItem: { display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' },

  settingsBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#d4af37', padding: '8px 16px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: 600,
    backdropFilter: 'blur(8px)', transition: 'background 0.2s',
  },
  dropdown: {
    position: 'absolute', top: '100%', right: 0, marginTop: '6px',
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
    padding: '6px', minWidth: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
    zIndex: 10, overflow: 'hidden',
  },
  dropdownItem: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '10px 14px', border: 'none', borderRadius: '8px',
    background: 'transparent', color: '#ccc', fontSize: '13px', fontWeight: 500,
    cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
  },

  statsBar: {
    display: 'flex', gap: 'clamp(8px, 1.5vw, 14px)', flexWrap: 'wrap',
    padding: '20px clamp(20px, 5vw, 60px) 0',
  },
  statCard: {
    flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    backdropFilter: 'blur(8px)',
  },
  statIcon: { width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(163,122,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue: { color: '#eee', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  statLabel: { color: '#888', fontSize: '11px', fontWeight: 500, marginTop: '1px' },

  divider: { height: '1px', margin: '20px clamp(20px, 5vw, 60px)', background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.3), transparent)' },

  contentArea: {
    display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px, 3vw, 40px)',
    padding: '0 clamp(20px, 5vw, 60px) clamp(28px, 4vw, 60px)',
  },
  leftCol: { flex: '1 1 50%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' },
  rightCol: { flex: '1 1 40%', minWidth: '280px', display: 'flex', flexDirection: 'column' },

  bioBox: { borderLeft: '3px solid #a37a39', padding: '16px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '0 12px 12px 0' },
  bioLabel: { color: '#d4af37', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  bioText: { color: '#bbb', fontSize: '14px', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word' },


  galleryHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  galleryLine: { flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.4) 50%, transparent)' },
  galleryTitle: { color: '#d4af37', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', flexShrink: 0 },

  carousel: {
    position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0d0d0d',
    flex: 1, minHeight: '220px',
  },
  carouselGradientLeft: { position: 'absolute', top: 0, left: 0, width: '30px', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselGradientRight: { position: 'absolute', top: 0, right: 0, width: '30px', height: '100%', background: 'linear-gradient(270deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselCounter: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#d4af37', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '12px', zIndex: 2, letterSpacing: '0.3px' },
  carouselImg: { width: '100%', height: 'clamp(220px, 30vw, 420px)', objectFit: 'cover', display: 'block', cursor: 'pointer' },
  carouselBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.55)', border: 'none',
    color: '#fff', borderRadius: '50%', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 2, transition: 'background 0.2s',
  },
  dots: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' },
  dot: (active) => ({ width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: active ? '#a37a39' : '#333', transition: 'background 0.2s', padding: 0 }),
  noImages: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', minHeight: '220px' },

  msg: { padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', border: '1px solid', fontSize: '14px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'clamp(14px, 2vw, 20px)' },
  field: { marginBottom: '2px' },
  fieldLabel: { color: '#d4af37', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#111', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  selectWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  select: { width: '100%', padding: '12px 36px 12px 14px', borderRadius: '10px', border: '1px solid #2a2a2a', background: '#111', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', appearance: 'none', transition: 'border-color 0.2s' },
  selectArrow: { position: 'absolute', right: '12px', pointerEvents: 'none' },
  btn: (saving) => ({ width: '100%', padding: '13px', marginTop: 'clamp(18px, 2.5vw, 24px)', background: 'linear-gradient(135deg, #a37a39, #d4af37)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s' }),
  spinner: { width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' },

  modalTitleBar: { display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '16px', fontWeight: '700', marginBottom: '20px' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  modal: { background: '#111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: 'clamp(20px, 3vw, 28px)', maxWidth: '560px', width: '90vw', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' },
  modalTitle: { color: '#d4af37', fontSize: '16px', fontWeight: '700', marginBottom: '14px', textAlign: 'center' },
  modalPreviewWrap: { borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', justifyContent: 'center', maxHeight: '260px' },
  modalPreview: { maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' },
  modalBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
  modalClose: { position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' },
};
