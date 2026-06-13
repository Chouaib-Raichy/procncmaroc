import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPartner } from '../api/partners';
import ErrorState from '../components/ErrorState';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.124-1.003-1.87-2.242-2.09-2.621-.222-.38-.024-.585.163-.772.166-.166.373-.434.56-.651.185-.218.247-.373.37-.622.123-.249.062-.467-.03-.652-.092-.186-.67-1.614-.918-2.21-.242-.579-.487-.48-.67-.489-.174-.009-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.71.307 1.264.49 1.695.627.713.227 1.362.195 1.875.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.302.652 4.457 1.785 6.3L.69 23.1l5.085-1.036A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.86 0-3.635-.54-5.148-1.557l-.37-.222-3.016.614.807-2.943-.24-.383A9.54 9.54 0 0 1 2.4 12c0-5.302 4.298-9.6 9.6-9.6s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" /></svg>
);

const MapsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.25 7.08 12.6 7.66 13.22.28.3.75.3 1.04 0 .58-.62 7.66-7.97 7.66-13.22C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/></svg>
);

const ImageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function formatRole(role) {
  if (role === 'admin') return 'Administrator';
  if (role === 'partner') return 'Partner';
  return 'Member';
}

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } });

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    if (!lightboxImg) return;
    const handler = (e) => { if (e.key === 'Escape') setLightboxImg(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxImg]);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getPartner(id).then((res) => { setData(res.data); setCarouselIndex(0); }).catch(() => setError('Failed to load profile.')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return (
    <div style={styles.wrapper}>
      <SEO title="Profile | PRO CNC MAROC" />
      <div style={styles.card}>
        <div style={{ ...styles.cover, background: '#111' }} />
        <div style={{ padding: '0 28px' }}>
          <div style={{ width: '110px', height: '110px', borderRadius: '50%', marginTop: '-55px', marginBottom: '16px', background: '#1a1a1a', border: '3px solid #222' }} />
          <div style={{ width: '180px', height: '22px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '8px' }} />
          <div style={{ width: '120px', height: '14px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ flex: 1, height: '70px', borderRadius: '12px', background: '#1a1a1a' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: '1 1 55%' }}>
              <div style={{ width: '100%', height: '120px', borderRadius: '12px', background: '#1a1a1a' }} />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <div style={{ width: '100%', height: '260px', borderRadius: '12px', background: '#1a1a1a' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <><SEO title="Profile | PRO CNC MAROC" /><ErrorState message={error} onRetry={fetch} /></>;

  if (!data?.user) return (
    <div style={styles.wrapper}>
      <SEO title="Profile | PRO CNC MAROC" />
      <p style={{ color: '#999', textAlign: 'center', paddingTop: '80px' }}>User not found</p>
    </div>
  );

  const u = data.user;
  const images = u.business_images_url || [];
  const roleLabel = formatRole(u.role);
  const memberSince = formatDate(u.created_at);

  return (
    <div style={styles.wrapper}>
      <SEO title={u.name + ' | PRO CNC MAROC'} description={u.business_bio || ('Profile of ' + u.name)} canonicalUrl={'/profile/' + id} />
      <motion.div style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Cover */}
        <motion.div {...fadeUp()} style={{ ...styles.cover, backgroundImage: `url(${u.profile_bg_url || machineBg})` }}>
          <div style={styles.coverOverlay} />
        </motion.div>

        {/* Avatar + Identity */}
        <div style={styles.identityWrap}>
          <motion.div
            style={{ ...styles.avatarWrap, cursor: u.avatar_url ? 'pointer' : 'default' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            onClick={() => u.avatar_url && setLightboxImg(u.avatar_url)}
          >
            {u.avatar_url ? (
              <img src={u.avatar_url} alt={u.name} style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>{u.name?.charAt(0).toUpperCase()}</div>
            )}
          </motion.div>
          <div style={styles.identityInfo}>
            <motion.h1 style={styles.name} {...fadeUp(0.2)}>{u.name}</motion.h1>
            <motion.div style={styles.roleRow} {...fadeUp(0.25)}>
              {u.entreprise_name && <span style={styles.entreprise}>{u.entreprise_name}</span>}
              <span style={styles.roleBadge}>{roleLabel}</span>
            </motion.div>
            <motion.div style={styles.contactMini} {...fadeUp(0.3)}>
              {u.email && <span style={styles.miniItem}><MailIcon />{u.email}</span>}
              {u.phone && <span style={styles.miniItem}><WhatsAppIcon />{u.phone}</span>}
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div style={styles.statsBar} {...fadeUp(0.35)}>
          {u.city && u.country && (
            <div style={styles.statCard}>
              <div style={styles.statIcon}><LocationIcon /></div>
              <div>
                <div style={styles.statValue}>{u.city}, {u.country}</div>
                <div style={styles.statLabel}>Location</div>
              </div>
            </div>
          )}
          {memberSince && (
            <div style={styles.statCard}>
              <div style={styles.statIcon}><CalendarIcon /></div>
              <div>
                <div style={styles.statValue}>{memberSince}</div>
                <div style={styles.statLabel}>Member Since</div>
              </div>
            </div>
          )}
          {u.entreprise_name && (
            <div style={styles.statCard}>
              <div style={styles.statIcon}><BuildingIcon /></div>
              <div>
                <div style={styles.statValue}>{u.entreprise_name}</div>
                <div style={styles.statLabel}>Company</div>
              </div>
            </div>
          )}
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div>
              <div style={styles.statValue}>{data.posts_count || 0}</div>
              <div style={styles.statLabel}>Posts</div>
            </div>
          </div>
        </motion.div>

        <div style={styles.divider} />

        {/* Content: Bio + Contact | Gallery */}
        <div style={styles.contentArea}>
          <motion.div style={styles.leftCol} {...fadeUp(0.4)}>
            {u.business_bio && (
              <div style={styles.bioBox}>
                <div style={styles.bioLabel}>About</div>
                <p style={styles.bioText}>{u.business_bio}</p>
              </div>
            )}

            <div style={styles.contactSection}>
              <div style={styles.contactLabel}>Contact</div>
              <div style={styles.contactButtons}>
                {u.phone && (
                  <a href={`https://wa.me/${u.phone.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.contactBtn, borderColor: '#25D366', color: '#25D366' }}>
                    <WhatsAppIcon /> WhatsApp
                  </a>
                )}
                {u.business_location && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.business_location)}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.contactBtn, borderColor: '#4285F4', color: '#4285F4' }}>
                    <MapsIcon /> Google Maps
                  </a>
                )}
                {u.email && (
                  <a href={`mailto:${u.email}`} style={{ ...styles.contactBtn, borderColor: '#d4af37', color: '#d4af37' }}>
                    <MailIcon /> Email
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div style={styles.rightCol} {...fadeUp(0.45)}>
            <div style={styles.galleryHeader}>
              <div style={styles.galleryLine} />
              <span style={styles.galleryTitle}>Gallery</span>
              <div style={styles.galleryLine} />
            </div>
            {images.length > 0 ? (
              <div style={styles.carousel}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={carouselIndex} src={images[carouselIndex]} alt=""
                    style={styles.carouselImg}
                    initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
                    onClick={() => setLightboxImg(images[carouselIndex])}
                  />
                </AnimatePresence>
                <div style={styles.carouselGradientLeft} />
                <div style={styles.carouselGradientRight} />
                <span style={styles.carouselCounter}>{carouselIndex + 1} / {images.length}</span>
                {images.length > 1 && (
                  <>
                    <button style={{ ...styles.carouselBtn, left: '8px' }} onClick={() => setCarouselIndex((p) => (p - 1 + images.length) % images.length)} aria-label="Previous">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button style={{ ...styles.carouselBtn, right: '8px' }} onClick={() => setCarouselIndex((p) => (p + 1) % images.length)} aria-label="Next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <div style={styles.dots}>
                      {images.map((_, i) => (
                        <button key={i} style={styles.dot(i === carouselIndex)} onClick={() => setCarouselIndex(i)} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={styles.noImages}>
                <ImageIcon />
                <p style={{ color: '#666', marginTop: '12px', fontSize: '14px' }}>No gallery images yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div style={styles.lightboxOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxImg(null)}>
            <button style={styles.lightboxClose} onClick={() => setLightboxImg(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <motion.img src={lightboxImg} alt="" style={styles.lightboxImg} onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.25 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat`,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: 'clamp(20px, 4vw, 60px)',
  },
  card: {
    maxWidth: '1000px', width: '100%',
    background: 'rgba(10,10,10,0.95)',
    border: '1px solid #1e1e1e',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 80px rgba(163,122,57,0.06), 0 20px 60px rgba(0,0,0,0.5)',
  },

  cover: {
    height: 'clamp(180px, 26vw, 280px)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  coverOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.85) 100%)',
  },

  identityWrap: {
    display: 'flex', alignItems: 'flex-end', gap: '20px',
    padding: '0 28px', marginTop: '-56px', position: 'relative', zIndex: 2,
  },
  avatarWrap: {
    width: '112px', height: '112px', borderRadius: '50%', flexShrink: 0,
    border: '3px solid #a37a39', overflow: 'hidden', background: '#111',
    boxShadow: '0 0 0 3px rgba(163,122,57,0.2), 0 8px 32px rgba(0,0,0,0.6)',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)', color: '#000', fontSize: '42px', fontWeight: 'bold',
  },
  identityInfo: { flex: 1, paddingBottom: '4px' },
  name: { color: '#d4af37', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: '700', margin: '0 0 4px' },
  roleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' },
  entreprise: { color: '#ccc', fontSize: '14px', fontWeight: 500 },
  roleBadge: {
    background: 'rgba(163,122,57,0.15)', color: '#d4af37', fontSize: '11px',
    fontWeight: 700, padding: '3px 12px', borderRadius: '20px',
    border: '1px solid rgba(163,122,57,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  contactMini: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '2px' },
  miniItem: {
    display: 'flex', alignItems: 'center', gap: '5px', color: '#888',
    fontSize: '12px', fontWeight: 500,
  },

  statsBar: {
    display: 'flex', gap: 'clamp(8px, 1.5vw, 14px)', flexWrap: 'wrap',
    padding: '20px 28px 0',
  },
  statCard: {
    flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    backdropFilter: 'blur(8px)',
  },
  statIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(163,122,57,0.1)', flexShrink: 0,
  },
  statValue: { color: '#eee', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  statLabel: { color: '#888', fontSize: '11px', fontWeight: 500, marginTop: '1px' },

  divider: {
    height: '1px', margin: '20px 28px',
    background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.3), transparent)',
  },

  contentArea: {
    display: 'flex', flexWrap: 'wrap', gap: '28px',
    padding: '0 28px 28px',
  },
  leftCol: { flex: '1 1 50%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' },
  rightCol: { flex: '1 1 40%', minWidth: '280px', display: 'flex', flexDirection: 'column' },

  bioBox: {
    borderLeft: '3px solid #a37a39',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '0 12px 12px 0',
  },
  bioLabel: {
    color: '#d4af37', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
  },
  bioText: { color: '#bbb', fontSize: '14px', lineHeight: 1.8, margin: 0 },

  contactSection: {},
  contactLabel: {
    color: '#d4af37', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
  },
  contactButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  contactBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
    padding: '8px 16px', borderRadius: '8px', border: '1px solid',
    fontSize: '12px', fontWeight: 600, background: 'rgba(0,0,0,0.3)',
    transition: 'background 0.2s',
  },

  galleryHeader: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
  },
  galleryLine: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.4) 50%, transparent)',
  },
  galleryTitle: {
    color: '#d4af37', fontSize: '13px', fontWeight: 700,
    letterSpacing: '2px', flexShrink: 0,
  },

  carousel: {
    position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0d0d0d',
    flex: 1, minHeight: '220px',
  },
  carouselGradientLeft: { position: 'absolute', top: 0, left: 0, width: '30px', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselGradientRight: { position: 'absolute', top: 0, right: 0, width: '30px', height: '100%', background: 'linear-gradient(270deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselCounter: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#d4af37', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '12px', zIndex: 2, letterSpacing: '0.3px' },
  carouselImg: {
    width: '100%', height: 'clamp(200px, 28vw, 360px)',
    objectFit: 'cover', display: 'block', cursor: 'pointer',
  },
  carouselBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.55)', border: 'none',
    color: '#fff', borderRadius: '50%', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 2, transition: 'background 0.2s',
  },
  dots: {
    display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px',
  },
  dot: (active) => ({
    width: '8px', height: '8px', borderRadius: '50%', border: 'none',
    cursor: 'pointer', background: active ? '#a37a39' : '#333',
    transition: 'background 0.2s', padding: 0,
  }),
  noImages: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: '#555', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', minHeight: '220px',
  },

  lightboxOverlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.92)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'zoom-out',
  },
  lightboxImg: {
    maxWidth: '92vw', maxHeight: '92vh',
    objectFit: 'contain', borderRadius: '8px',
    cursor: 'default', boxShadow: '0 0 60px rgba(0,0,0,0.6)',
  },
  lightboxClose: {
    position: 'fixed', top: '20px', right: '24px',
    background: 'rgba(255,255,255,0.08)', border: 'none',
    color: '#fff', width: '44px', height: '44px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10000,
  },
};
