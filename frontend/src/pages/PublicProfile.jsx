import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPartner } from '../api/partners';
import ErrorState from '../components/ErrorState';
import machineBg from '../assets/machineBG.jpeg';
import whatsappIcon from '../assets/whatsapp_icon.svg';
import googleMapsIcon from '../assets/google_maps_icon.svg';
import SEO from '../components/SEO';

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
    getPartner(id).then((res) => setData(res.data)).catch(() => setError('Failed to load profile.')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return (
    <div style={styles.wrapper}>
      <SEO title="Profil | PRO CNC MAROC" />
      <div style={styles.card}>
        <div style={{ ...styles.cover, background: '#111' }} />
        <div style={{ textAlign: 'center', padding: '60px 20px' }}><div style={styles.loader} /></div>
      </div>
    </div>
  );

  if (error) return <><SEO title="Profil | PRO CNC MAROC" /><ErrorState message={error} onRetry={fetch} /></>;

  if (!data?.user) return (
    <div style={styles.wrapper}>
      <SEO title="Profil | PRO CNC MAROC" />
      <p style={{ color: '#999', textAlign: 'center', paddingTop: '80px' }}>User not found</p>
    </div>
  );

  const u = data.user;
  const images = u.business_images_url || [];

  return (
    <div style={styles.wrapper}>
      <SEO title={u.name + ' | PRO CNC MAROC'} description={u.business_bio || ('Profil de ' + u.name)} canonicalUrl={'/profile/' + id} />
      <motion.div style={styles.card} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={styles.twoCol}>
          <div style={styles.leftCol}>
            {/* Cover */}
            <div style={{ ...styles.cover, backgroundImage: `url(${u.profile_bg_url || machineBg})`, cursor: u.profile_bg_url ? 'pointer' : 'default' }}
                 onClick={() => u.profile_bg_url && setLightboxImg(u.profile_bg_url)}>
              <div style={styles.coverOverlay} />
            </div>

            {/* Avatar */}
            <div style={styles.avatarSection}>
              <motion.div style={{ ...styles.avatarWrap, cursor: u.avatar_url ? 'pointer' : 'default' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                onClick={() => u.avatar_url && setLightboxImg(u.avatar_url)}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarPlaceholder}>{u.name?.charAt(0).toUpperCase()}</div>
                )}
              </motion.div>
              <motion.h1 style={styles.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{u.name}</motion.h1>
              <motion.p style={styles.role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{u.role === 'admin' ? 'Administrator' : u.entreprise_name || 'Member'}</motion.p>
            </div>

            {/* Bio */}
            {u.business_bio && (
              <motion.div style={styles.bioBox} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div style={styles.bioLabel}>About</div>
                <p style={styles.bioText}>{u.business_bio}</p>
              </motion.div>
            )}

            {/* Info Grid */}
            {/* Contact Icons */}
            <motion.div style={styles.contactRow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {u.phone && (
                <a href={`https://wa.me/${u.phone.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" style={styles.contactIcon} title="WhatsApp">
                  <img src={whatsappIcon} alt="WhatsApp" style={styles.contactIconImg} />
                </a>
              )}
              {u.business_location && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.business_location)}`} target="_blank" rel="noopener noreferrer" style={styles.contactIcon} title="Location">
                  <img src={googleMapsIcon} alt="Google Maps" style={styles.contactIconImg} />
                </a>
              )}
              {u.city && u.country && (
                <span style={styles.contactCity}>{u.city}, {u.country}</span>
              )}
            </motion.div>
          </div>

          <div style={styles.rightCol}>
            {/* Gallery Title */}
            <div style={styles.galleryTitleOuter}>
              <div style={styles.galleryTitleLine} />
              <div style={styles.galleryTitleDiamond}>✦</div>
              <div style={styles.galleryTitleText}>GALLERY OF ACHIEVEMENTS</div>
              <div style={styles.galleryTitleDiamond}>✦</div>
              <div style={styles.galleryTitleLine} />
            </div>

            {/* Business Gallery Carousel */}
            {images.length > 0 ? (
              <motion.div style={styles.carousel} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <AnimatePresence mode="wait">
                  <motion.img key={carouselIndex} src={images[carouselIndex]} alt=""
                    style={styles.carouselImg}
                    initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.25 }}
                    onClick={() => setLightboxImg(images[carouselIndex])}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button style={{ ...styles.carouselBtn, left: '8px' }} onClick={() => setCarouselIndex((p) => (p - 1 + images.length) % images.length)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button style={{ ...styles.carouselBtn, right: '8px' }} onClick={() => setCarouselIndex((p) => (p + 1) % images.length)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </>
                )}
                {images.length > 1 && (
                  <div style={styles.dots}>
                    {images.map((_, i) => (
                      <button key={i} style={styles.dot(i === carouselIndex)} onClick={() => setCarouselIndex(i)} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div style={styles.noImages}>No images available</div>
            )}


          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      {lightboxImg && (
        <div style={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <button style={styles.lightboxClose} onClick={() => setLightboxImg(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={lightboxImg} alt="" style={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat`,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: 'clamp(20px, 4vw, 60px)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  loader: {
    width: '36px', height: '36px', margin: '0 auto',
    border: '3px solid #333', borderTopColor: '#a37a39',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  card: {
    maxWidth: '1100px', width: '100%',
    background: 'linear-gradient(145deg, #0d0d0d, #161616)',
    border: '1px solid #2a2a2a',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 80px rgba(163,122,57,0.08), 0 20px 60px rgba(0,0,0,0.5)',
  },
  twoCol: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 55%',
    minWidth: '320px',
  },
  rightCol: {
    flex: '1 1 45%',
    minWidth: '300px',
    padding: 'clamp(20px, 3vw, 36px)',
    display: 'flex', flexDirection: 'column',
    borderLeft: '1px solid #222',
  },
  galleryTitleOuter: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '24px',
  },
  galleryTitleLine: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, transparent, #a37a39 50%, transparent)',
  },
  galleryTitleDiamond: {
    color: '#d4af37', fontSize: '10px', opacity: 0.7, flexShrink: 0,
  },
  galleryTitleText: {
    color: '#d4af37',
    fontSize: 'clamp(13px, 1.6vw, 17px)',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '2px',
    lineHeight: 1.5,
    flexShrink: 0,
  },
  cover: {
    height: 'clamp(160px, 24vw, 260px)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  coverOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)',
  },

  avatarSection: {
    textAlign: 'center',
    marginTop: '-60px',
    position: 'relative',
    zIndex: 1,
    padding: '0 24px',
  },
  avatarWrap: {
    width: '120px', height: '120px', margin: '0 auto 16px',
    borderRadius: '50%',
    border: '3px solid #a37a39',
    overflow: 'hidden',
    background: '#111',
    boxShadow: '0 0 0 3px rgba(163,122,57,0.2), 0 8px 32px rgba(0,0,0,0.5)',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#000', fontSize: '48px', fontWeight: 'bold',
  },
  name: {
    color: '#d4af37', fontSize: 'clamp(24px, 3.5vw, 30px)',
    fontWeight: '700', margin: '0 0 4px',
  },
  role: {
    color: '#555', fontSize: '12px', margin: '0 0 0',
    textTransform: 'uppercase', letterSpacing: '1.5px',
  },

  bioBox: {
    margin: '20px 24px 0',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #222',
    borderRadius: '12px',
  },
  bioLabel: {
    color: '#a37a39', fontSize: '12px', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
  },
  bioText: {
    color: '#aaa', fontSize: '14px', lineHeight: 1.8, margin: 0,
  },

  contactRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 24px',
  },
  contactIcon: {
    width: '40px', height: '40px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', flexShrink: 0,
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  contactIconImg: {
    width: '100%', height: '100%', display: 'block',
  },
  contactCity: {
    fontSize: '13px', color: '#888', fontStyle: 'italic',
    marginLeft: 'auto',
  },

  carousel: {
    position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#111',
    flex: 1,
  },
  carouselImg: {
    width: '100%', height: 'clamp(200px, 30vw, 400px)',
    objectFit: 'cover', display: 'block', cursor: 'pointer',
  },
  carouselBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', borderRadius: '50%', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 2, backdropFilter: 'blur(4px)',
  },
  dots: {
    display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px',
  },
  dot: (active) => ({
    width: '10px', height: '10px', borderRadius: '50%', border: 'none',
    cursor: 'pointer', background: active ? '#a37a39' : '#333',
    transition: 'background 0.2s',
  }),
  noImages: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#555', fontSize: '14px', fontStyle: 'italic',
    background: 'rgba(0,0,0,0.2)', borderRadius: '12px', minHeight: '200px',
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
    transition: 'background 0.2s',
  },
};
