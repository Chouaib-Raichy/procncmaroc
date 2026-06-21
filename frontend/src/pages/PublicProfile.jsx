import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPartner } from '../api/partners';
import { getSettings } from '../api/settings';
import ErrorState from '../components/ErrorState';
import machineBg from '../assets/machineBG.jpeg';
import placeholderImg from '../assets/placeholder.svg';
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
  const [bioModal, setBioModal] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ show_whatsapp: '1', show_maps: '1', show_email: '1' });

  useEffect(() => {
    if (!lightboxImg && !bioModal) return;
    const handler = (e) => { if (e.key === 'Escape') { setLightboxImg(null); setBioModal(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxImg, bioModal]);

  useEffect(() => { getSettings().then((r) => setSiteSettings(r.data)).catch(() => {}); }, []);

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
        <div style={{ padding: '0 clamp(20px, 5vw, 60px)' }}>
          <div style={{ width: '110px', height: '110px', borderRadius: '50%', marginTop: '-55px', marginBottom: '16px', background: '#1a1a1a', border: '3px solid #222' }} />
          <div style={{ width: 'clamp(140px, 20vw, 220px)', height: '22px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '8px' }} />
          <div style={{ width: 'clamp(100px, 15vw, 160px)', height: '14px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ flex: '1 1 160px', height: '70px', borderRadius: '12px', background: '#1a1a1a' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 40px)', paddingBottom: '40px' }}>
            <div style={{ flex: '1 1 50%' }}>
              <div style={{ width: '100%', height: 'clamp(100px, 14vw, 160px)', borderRadius: '12px', background: '#1a1a1a' }} />
            </div>
            <div style={{ flex: '1 1 40%' }}>
              <div style={{ width: '100%', height: 'clamp(220px, 30vw, 420px)', borderRadius: '12px', background: '#1a1a1a' }} />
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
  const mapsLink = (loc) => {
    if (!loc) return '#';
    if (loc.startsWith('http')) {
      const m = loc.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (m) return `https://www.google.com/maps/search/?api=1&query=${m[1]},${m[2]}`;
      return loc;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        .prof-carousel:hover .prof-carousel-btn { opacity: 1; }
        .prof-bio-text { display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
        .prof-stat-card { transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; }
        .prof-stat-card:hover { transform: translateY(-2px); border-color: rgba(163,122,57,0.3) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(163,122,57,0.08); }
        .prof-stat-card:hover .prof-stat-icon { background: rgba(163,122,57,0.2) !important; }
        .prof-contact-btn { position: relative; overflow: hidden; }
        .prof-contact-btn::before { content: ''; position: absolute; inset: 0; border-radius: 7px; opacity: 0; transition: opacity 0.3s; background: currentColor; }
        .prof-contact-btn:hover::before { opacity: 0.1; }
        .prof-contact-btn:hover { background: rgba(255,255,255,0.05) !important; transform: translateY(-1px); }
        .prof-contact-btn { transition: transform 0.2s; }
        @keyframes prof-avatar-glow { 0%, 100% { box-shadow: 0 0 0 3px rgba(163,122,57,0.2), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(163,122,57,0.1); } 50% { box-shadow: 0 0 0 3px rgba(163,122,57,0.3), 0 8px 32px rgba(0,0,0,0.6), 0 0 35px rgba(163,122,57,0.2); } }
        .prof-avatar-wrap { animation: prof-avatar-glow 3s ease-in-out infinite; }
        .prof-thumb { transition: all 0.2s; cursor: pointer; border: 2px solid transparent; border-radius: 6px; opacity: 0.6; }
        .prof-thumb:hover { border-color: rgba(163,122,57,0.5); opacity: 0.9; transform: translateY(-2px); }
        .prof-thumb.active { border-color: #d4af37; opacity: 1; }
        .prof-lightbox-nav { transition: all 0.25s; opacity: 0; }
        .prof-lightbox-show:hover .prof-lightbox-nav { opacity: 1; }
        .prof-bio-more:hover { opacity: 1 !important; }
        .prof-bio-modal-close:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .prof-bio-modal-content::-webkit-scrollbar { width: 4px; }
        .prof-bio-modal-content::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
        .prof-bio-modal-content::-webkit-scrollbar-thumb { background: rgba(163,122,57,0.4); border-radius: 4px; }
        .prof-name { background: linear-gradient(135deg, #d4af37 0%, #f0d68a 50%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .prof-thumbs::-webkit-scrollbar { height: 3px; }
        .prof-thumbs::-webkit-scrollbar-track { background: transparent; }
        .prof-thumbs::-webkit-scrollbar-thumb { background: rgba(163,122,57,0.3); border-radius: 3px; }
        @media (max-width: 768px) {
          .prof-content-area { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <SEO title={u.name + ' | PRO CNC MAROC'} description={u.business_bio || ('Profile of ' + u.name)} canonicalUrl={'/profile/' + id} />
      <motion.div style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Cover */}
        <motion.div {...fadeUp()} style={{ ...styles.cover, backgroundImage: `url(${u.profile_bg_url || placeholderImg})` }}>
          <div style={styles.coverOverlay} />
        </motion.div>

        {/* Avatar + Identity */}
        <div style={styles.identityWrap}>
          <motion.div
            className="prof-avatar-wrap"
            style={{ ...styles.avatarWrap, cursor: u.avatar_url ? 'pointer' : 'default' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            onClick={() => u.avatar_url && setLightboxImg(u.avatar_url)}
          >
            <img src={u.avatar_url || placeholderImg} alt={u.name} style={styles.avatarImg} />
          </motion.div>
          <div style={styles.identityInfo}>
            <motion.h1 className="prof-name" style={styles.name} {...fadeUp(0.2)}>{u.name}</motion.h1>
            <motion.div style={styles.roleRow} {...fadeUp(0.25)}>
              {u.entreprise_name && <span style={styles.entreprise}>{u.entreprise_name}</span>}
              <span style={styles.roleBadge}>{roleLabel}</span>
            </motion.div>

          </div>
        </div>

        {/* Stats Bar */}
        <motion.div style={styles.statsBar} {...fadeUp(0.35)}>
          {u.city && u.country && (
              <div className="prof-stat-card" style={styles.statCard}>
              <div className="prof-stat-icon" style={styles.statIcon}><LocationIcon /></div>
              <div>
                <div style={styles.statValue}>{u.city}, {u.country}</div>
                <div style={styles.statLabel}>Location</div>
              </div>
            </div>
          )}
          {memberSince && (
              <div className="prof-stat-card" style={styles.statCard}>
              <div className="prof-stat-icon" style={styles.statIcon}><CalendarIcon /></div>
              <div>
                <div style={styles.statValue}>{memberSince}</div>
                <div style={styles.statLabel}>Member Since</div>
              </div>
            </div>
          )}
          {u.entreprise_name && (
              <div className="prof-stat-card" style={styles.statCard}>
              <div className="prof-stat-icon" style={styles.statIcon}><BuildingIcon /></div>
              <div>
                <div style={styles.statValue}>{u.entreprise_name}</div>
                <div style={styles.statLabel}>Company</div>
              </div>
            </div>
          )}
          <div className="prof-stat-card" style={styles.statCard}>
            <div className="prof-stat-icon" style={styles.statIcon}>
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
        <div className="prof-content-area" style={styles.contentArea}>
          <motion.div style={styles.leftCol} {...fadeUp(0.4)}>
            {u.business_bio && (
              <div style={styles.bioBox}>
                <div style={styles.bioLabel}><span style={styles.bioLabelDot} />About</div>
                <p className="prof-bio-text" style={styles.bioText}>{u.business_bio}</p>
                <button className="prof-bio-more" style={styles.bioViewMore} onClick={() => setBioModal(true)}>
                  View more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            )}

            <div style={styles.contactSection}>
              <div style={styles.contactLabel}><span style={styles.bioLabelDot} />Contact</div>
              <div style={styles.contactButtons}>
                {u.phone && siteSettings.show_whatsapp === '1' && (
                  <a className="prof-contact-btn" href={`https://wa.me/${u.phone.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.contactBtn, borderColor: '#25D366', color: '#25D366' }}>
                    <WhatsAppIcon /> WhatsApp
                  </a>
                )}
                {u.business_location && siteSettings.show_maps === '1' && (
                  <a className="prof-contact-btn" href={mapsLink(u.business_location)} target="_blank" rel="noopener noreferrer" style={{ ...styles.contactBtn, borderColor: '#4285F4', color: '#4285F4' }}>
                    <MapsIcon /> Google Maps
                  </a>
                )}
                {u.email && siteSettings.show_email === '1' && (
                  <a className="prof-contact-btn" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(u.email)}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.contactBtn, borderColor: '#d4af37', color: '#d4af37' }}>
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
              <>
                <div className="prof-carousel" style={styles.carousel}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={carouselIndex} src={images[carouselIndex]} alt=""
                      className="prof-carousel-img"
                      style={styles.carouselImg}
                      initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
                      whileHover={{ scale: 1.03 }} onClick={() => setLightboxImg(images[carouselIndex])}
                    />
                  </AnimatePresence>
                  <div style={styles.carouselGradientLeft} />
                  <div style={styles.carouselGradientRight} />
                  <span style={styles.carouselCounter}>{carouselIndex + 1} / {images.length}</span>
                  {images.length > 1 && (
                    <>
                      <button className="prof-carousel-btn" style={{ ...styles.carouselBtn, left: '8px' }} onClick={() => setCarouselIndex((p) => (p - 1 + images.length) % images.length)} aria-label="Previous">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                      </button>
                      <button className="prof-carousel-btn" style={{ ...styles.carouselBtn, right: '8px' }} onClick={() => setCarouselIndex((p) => (p + 1) % images.length)} aria-label="Next">
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
                {images.length > 1 && (
                  <div className="prof-thumbs" style={styles.thumbsStrip}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt=""
                        className={`prof-thumb${i === carouselIndex ? ' active' : ''}`}
                        style={{ ...styles.thumbImg, ...(i === carouselIndex ? styles.thumbActive : {}) }}
                        onClick={() => setCarouselIndex(i)} />
                    ))}
                  </div>
                )}
              </>
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
          <motion.div className="prof-lightbox-show" style={styles.lightboxOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxImg(null)}>
            <button style={styles.lightboxClose} onClick={() => setLightboxImg(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {images.length > 1 && (
              <>
                <button className="prof-lightbox-nav" style={{ ...styles.lightboxNav, left: '24px' }} onClick={(e) => { e.stopPropagation(); setCarouselIndex((p) => (p - 1 + images.length) % images.length); setLightboxImg(images[(carouselIndex - 1 + images.length) % images.length]); }} aria-label="Previous">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button className="prof-lightbox-nav" style={{ ...styles.lightboxNav, right: '24px' }} onClick={(e) => { e.stopPropagation(); setCarouselIndex((p) => (p + 1) % images.length); setLightboxImg(images[(carouselIndex + 1) % images.length]); }} aria-label="Next">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </>
            )}
            <AnimatePresence mode="wait">
              <motion.img key={lightboxImg} src={lightboxImg} alt="" style={styles.lightboxImg} onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.2 }} />
            </AnimatePresence>
            {images.length > 1 && (
              <div style={styles.lightboxCounter}>{carouselIndex + 1} / {images.length}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bio Modal */}
      <AnimatePresence>
        {bioModal && (
          <motion.div style={styles.bioModalOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setBioModal(false)}
          >
            <motion.div style={styles.bioModalCard}
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.bioModalHeader}>
                <div style={styles.bioModalTitle}><span style={styles.bioLabelDot} />About</div>
                <button className="prof-bio-modal-close" style={styles.bioModalClose} onClick={() => setBioModal(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="prof-bio-modal-content" style={styles.bioModalContent}>
                {u.entreprise_name && <div style={styles.bioModalSub}>{u.entreprise_name}</div>}
                <p style={styles.bioModalText}>{u.business_bio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat`,
  },
  card: {
    width: '100%',
    background: 'rgba(10,10,10,0.95)',
    minHeight: '100vh',
  },

  cover: {
    height: 'clamp(200px, 30vw, 340px)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  coverOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.85) 100%)',
  },

  identityWrap: {
    display: 'flex', alignItems: 'flex-end', gap: 'clamp(16px, 2.5vw, 28px)',
    padding: '0 clamp(20px, 5vw, 60px)', marginTop: '-56px', position: 'relative', zIndex: 2,
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
  statIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(163,122,57,0.1)', flexShrink: 0,
  },
  statValue: { color: '#eee', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  statLabel: { color: '#888', fontSize: '11px', fontWeight: 500, marginTop: '1px' },

  divider: {
    height: '1px', margin: '20px clamp(20px, 5vw, 60px)',
    background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.3), transparent)',
  },

  contentArea: {
    display: 'grid',
    gridTemplateColumns: '1.25fr 1fr',
    gap: 'clamp(20px, 3vw, 40px)',
    padding: '0 clamp(20px, 5vw, 60px) clamp(28px, 4vw, 60px)',
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  rightCol: { display: 'flex', flexDirection: 'column' },

  bioBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    background: 'rgba(255,255,255,0.015)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    borderLeft: '2px solid rgba(163,122,57,0.5)',
  },
  bioLabel: {
    color: '#d4af37', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: 0, margin: 0,
  },
  bioLabelDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#d4af37', flexShrink: 0,
  },
  bioText: { color: '#bbb', fontSize: '14px', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word', overflow: 'hidden' },
  bioViewMore: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', color: '#d4af37',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    padding: '4px 0 0', alignSelf: 'flex-start',
    transition: 'opacity 0.2s', opacity: 0.8,
  },

  contactSection: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    padding: '20px', background: 'rgba(255,255,255,0.015)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    borderLeft: '2px solid rgba(163,122,57,0.5)',
  },
  contactLabel: {
    color: '#d4af37', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: 0, margin: 0,
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
    border: '1px solid rgba(255,255,255,0.06)',
  },
  carouselGradientLeft: { position: 'absolute', top: 0, left: 0, width: '50px', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.5), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselGradientRight: { position: 'absolute', top: 0, right: 0, width: '50px', height: '100%', background: 'linear-gradient(270deg, rgba(0,0,0,0.5), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselCounter: {
    position: 'absolute', top: '14px', right: '14px',
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
    color: '#d4af37', fontSize: '11px', fontWeight: 700,
    padding: '4px 14px', borderRadius: '20px', zIndex: 2,
    letterSpacing: '0.5px', border: '1px solid rgba(163,122,57,0.2)',
  },
  carouselImg: {
    width: '100%', height: 'clamp(220px, 30vw, 420px)',
    objectFit: 'cover', display: 'block', cursor: 'pointer',
    transition: 'transform 0.4s',
  },
  carouselBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff', borderRadius: '50%', width: '38px', height: '38px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 2, transition: 'all 0.25s',
    opacity: 0.7,
  },
  dots: {
    position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', justifyContent: 'center', gap: '8px',
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    padding: '6px 14px', borderRadius: '20px',
    zIndex: 2,
  },
  dot: (active) => ({
    width: '8px', height: '8px', borderRadius: '50%', border: 'none',
    cursor: 'pointer', background: active ? '#d4af37' : '#333',
    transition: 'all 0.3s', padding: 0,
    transform: active ? 'scale(1.3)' : 'scale(1)',
    boxShadow: active ? '0 0 6px rgba(212,175,55,0.4)' : 'none',
  }),
  thumbsStrip: {
    display: 'flex', gap: '8px', marginTop: '12px',
    overflowX: 'auto', paddingBottom: '4px',
    scrollbarWidth: 'thin', scrollbarColor: 'rgba(163,122,57,0.3) transparent',
  },
  thumbImg: {
    width: '64px', height: '48px', borderRadius: '6px', objectFit: 'cover',
    flexShrink: 0, border: '2px solid transparent', transition: 'all 0.2s',
  },
  thumbActive: { borderColor: '#d4af37', opacity: 1 },
  noImages: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: '#555', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', minHeight: '220px',
    border: '1px solid rgba(255,255,255,0.06)',
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
    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
    width: '44px', height: '44px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10000, transition: 'all 0.2s',
  },
  lightboxNav: {
    position: 'fixed', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
    width: '48px', height: '48px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10000, transition: 'all 0.25s',
  },
  lightboxCounter: {
    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(163,122,57,0.2)', color: '#d4af37',
    fontSize: '13px', fontWeight: 700, padding: '8px 20px',
    borderRadius: '20px', zIndex: 10000, letterSpacing: '0.5px',
  },

  bioModalOverlay: {
    position: 'fixed', inset: 0, zIndex: 9998,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  bioModalCard: {
    width: '100%', maxWidth: '600px', maxHeight: '80vh',
    background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(163,122,57,0.3)',
    borderRadius: '16px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(163,122,57,0.15)',
  },
  bioModalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 0',
  },
  bioModalTitle: {
    color: '#d4af37', fontSize: '12px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  bioModalClose: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#999', width: '32px', height: '32px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  bioModalContent: {
    padding: '16px 24px 24px', overflowY: 'auto', flex: 1,
    scrollbarWidth: 'thin', scrollbarColor: '#a37a39 rgba(255,255,255,0.03)',
  },
  bioModalSub: {
    color: '#888', fontSize: '12px', fontWeight: 500, marginBottom: '12px',
    letterSpacing: '0.3px',
  },
  bioModalText: {
    color: '#ccc', fontSize: '15px', lineHeight: 1.9, margin: 0,
    whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word',
  },
};
