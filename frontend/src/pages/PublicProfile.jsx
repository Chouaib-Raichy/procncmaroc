import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPartner } from '../api/partners';
import ErrorState from '../components/ErrorState';
import machineBg from '../assets/machineBG.jpeg';

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getPartner(id).then((res) => setData(res.data)).catch(() => setError('Failed to load profile.')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={{ ...styles.bg, background: '#111' }} />
        <div style={{ textAlign: 'center', padding: '40px 20px 50px' }}>
          <div style={styles.loader} />
        </div>
      </div>
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={fetch} />;

  if (!data?.user) return (
    <div style={styles.wrapper}>
      <p style={{ color: '#999', textAlign: 'center', paddingTop: '80px' }}>User not found</p>
    </div>
  );

  const u = data.user;

  return (
    <div style={styles.wrapper}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ ...styles.bg, backgroundImage: `url(${u.profile_bg_url || machineBg})` }} />
        <div style={styles.bgOverlay} />
        <div style={styles.content}>
          <motion.div
            style={styles.avatarWrap}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {u.avatar_url ? (
              <img src={u.avatar_url} alt={u.name} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>{u.name?.charAt(0).toUpperCase()}</div>
            )}
          </motion.div>

          <motion.h1 style={styles.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{u.name}</motion.h1>
          <motion.p style={styles.role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>{u.role === 'admin' ? 'Administrator' : 'Member'}</motion.p>

          <motion.div style={styles.divider} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }} />

          <motion.div style={styles.infoGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            {u.email && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>&#9993;</span>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{u.email}</span>
              </div>
            )}
            {u.phone && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>&#9742;</span>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>{u.phone}</span>
              </div>
            )}
            {u.business_location && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>&#9906;</span>
                <span style={styles.infoLabel}>Business</span>
                <span style={styles.infoValue}>{u.business_location}</span>
              </div>
            )}
            {u.city && u.country && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>&#127758;</span>
                <span style={styles.infoLabel}>Location</span>
                <span style={styles.infoValue}>{u.city}, {u.country}</span>
              </div>
            )}
          </motion.div>

          {data.posts_count > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link to="/customer-gallery" style={styles.galleryLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                Gallery ({data.posts_count} {data.posts_count === 1 ? 'post' : 'posts'})
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: `url(${machineBg}) center/cover fixed no-repeat`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 'clamp(20px, 4vw, 60px)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  loader: {
    width: '36px', height: '36px', margin: '0 auto',
    border: '3px solid #333', borderTopColor: '#a37a39',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  card: {
    maxWidth: '520px', width: '100%',
    background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
    border: '1px solid #a37a39',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 60px rgba(163,122,57,0.12), 0 20px 60px rgba(0,0,0,0.5)',
  },
  bg: {
    height: 'clamp(150px, 22vw, 220px)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 'clamp(150px, 22vw, 220px)',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.85) 100%)',
  },
  content: {
    padding: '0 clamp(24px, 4vw, 40px) clamp(32px, 4vw, 48px)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    marginTop: '-55px',
  },
  avatarWrap: {
    width: '110px', height: '110px', margin: '0 auto 18px',
    borderRadius: '50%',
    border: '3px solid #a37a39',
    overflow: 'hidden',
    background: '#111',
    boxShadow: '0 0 0 3px rgba(163,122,57,0.2), 0 8px 32px rgba(0,0,0,0.4)',
  },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#000', fontSize: '44px', fontWeight: 'bold',
  },
  name: {
    color: '#d4af37', fontSize: 'clamp(24px, 3vw, 30px)',
    fontWeight: '700', margin: '0 0 4px',
  },
  role: {
    color: '#555', fontSize: '13px', margin: '0 0 20px',
    textTransform: 'uppercase', letterSpacing: '1.5px',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #a37a39, transparent)',
    margin: '0 0 24px',
    transformOrigin: 'center',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    textAlign: 'left',
  },
  infoItem: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #222',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  infoIcon: { fontSize: '18px', display: 'block', marginBottom: '4px' },
  infoLabel: { fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' },
  infoValue: { fontSize: '13px', color: '#ccc', fontWeight: '600' },
  galleryLink: {
    display: 'inline-flex', alignItems: 'center', marginTop: '20px',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#000', textDecoration: 'none',
    borderRadius: '10px', fontWeight: '700',
    fontSize: '14px',
    transition: 'transform 0.2s',
  },
};
