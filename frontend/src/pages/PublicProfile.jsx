import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  if (loading) return <div style={styles.wrapper}><div style={styles.loader} /></div>;

  if (error) return <ErrorState message={error} onRetry={fetch} />;

  if (!data?.user) return (
    <div style={styles.wrapper}>
      <p style={{ color: '#999', textAlign: 'center', paddingTop: '80px' }}>User not found</p>
    </div>
  );

  const u = data.user;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.bg} />
        <div style={styles.content}>
          <div style={styles.avatarWrap}>
            {u.avatar_url ? (
              <img src={u.avatar_url} alt={u.name} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>{u.name?.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <h1 style={styles.name}>{u.name}</h1>
          {u.email && <p style={styles.info}>&#9993; {u.email}</p>}
          {u.phone && <p style={styles.info}>&#9742; {u.phone}</p>}
          {u.business_location && <p style={styles.info}>&#9906; {u.business_location}</p>}
          {u.city && u.country && <p style={styles.info}>&#127758; {u.city}, {u.country}</p>}
          {data.posts_count > 0 && (
            <Link to="/customer-gallery" style={styles.galleryLink}>
              View Gallery Posts ({data.posts_count})
            </Link>
          )}
        </div>
      </div>
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
    width: '36px', height: '36px',
    border: '3px solid #333', borderTopColor: '#a37a39',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  card: {
    maxWidth: '480px', width: '100%',
    background: 'linear-gradient(135deg, #111, #1a1a1a)',
    border: '1px solid #a37a39',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 40px #a37a3922, 0 0 80px #a37a3911',
  },
  bg: {
    height: '140px',
    background: `url(${machineBg}) center/cover no-repeat`,
    borderBottom: '1px solid #a37a39',
  },
  content: {
    padding: 'clamp(20px, 3vw, 32px)',
    textAlign: 'center',
    position: 'relative',
    marginTop: '-50px',
  },
  avatarWrap: {
    width: '100px', height: '100px',
    borderRadius: '50%',
    border: '3px solid #a37a39',
    overflow: 'hidden',
    margin: '0 auto 16px',
    background: '#111',
    boxShadow: '0 0 20px #a37a3944',
  },
  avatar: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#a37a39', fontSize: '36px', fontWeight: 700, background: '#1a1a1a',
  },
  name: {
    color: '#d4af37', fontSize: 'clamp(22px, 3vw, 28px)',
    fontWeight: 700, margin: '0 0 12px',
  },
  info: {
    color: '#aaa', fontSize: 'clamp(13px, 1.2vw, 15px)',
    margin: '6px 0', lineHeight: 1.5,
  },
  galleryLink: {
    display: 'inline-block', marginTop: '20px',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#000', fontWeight: 700,
    borderRadius: '8px', textDecoration: 'none',
    fontSize: 'clamp(13px, 1.1vw, 15px)',
    transition: 'filter 0.2s',
  },
};
