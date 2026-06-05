import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const getImageUrl = (path) => path ? `${BASE_URL.replace('/api', '')}/storage/${path}` : null;
const getPdfUrl = (path) => path ? `${BASE_URL.replace('/api', '')}/storage/${path}` : null;

export default function MachineDetail() {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/machines/${id}`)
      .then((res) => setMachine(res.data))
      .catch(() => setMachine(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.center}>Loading...</div>
      </div>
    </div>
    );
  }

  if (!machine) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay}>
          <div style={styles.center}>
            <h2 style={{ color: '#fff' }}>Machine not found</h2>
            <Link to="/our-machines" style={{ color: '#a37a39', display: 'inline-block', marginTop: '12px' }}>Back to Machines</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.inner}>
          <Link to="/our-machines" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
            &larr; Back to Machines
          </Link>

          <div style={styles.content}>
            <div style={styles.imageWrap}>
              <img
                src={getImageUrl(machine.image) || 'https://placehold.co/800x500/333/fff?text=No+Image'}
                alt={machine.title}
                style={styles.image}
              />
            </div>

            <div style={styles.info}>
              <h1 style={styles.title}>{machine.title}</h1>
              {machine.category && (
                <span style={styles.category}>{machine.category.name}</span>
              )}
              {machine.price && (
                <p style={styles.price}>{parseFloat(machine.price).toLocaleString()} MAD</p>
              )}
              <p style={styles.description}>{machine.description}</p>

              {machine.features && machine.features.length > 0 && (
                <div style={styles.featuresBox}>
                  <h3 style={styles.featuresTitle}>Exclusive Features :</h3>
                  <ul style={styles.featuresList}>
                    {machine.features.map((f, i) => (
                      <li key={i} style={styles.featureItem}><span style={styles.bullet}></span>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={styles.actions}>
                {machine.pdf && (
                  <a href={getPdfUrl(machine.pdf)} target="_blank" rel="noopener noreferrer" style={styles.pdfBtn}>
                    Technical Specs (PDF)
                  </a>
                )}
                <button style={styles.btn}>Inquire Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  center: {
    textAlign: 'center',
    paddingTop: '80px',
    color: '#aaa',
    fontSize: '16px',
  },
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.7)',
    padding: 'clamp(20px, 3vw, 40px) clamp(16px, 4vw, 60px)',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    gap: 'clamp(20px, 3vw, 40px)',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  imageWrap: {
    flex: '1 1 clamp(280px, 40vw, 480px)',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '3px solid #a37a39',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  info: {
    flex: '1 1 clamp(260px, 35vw, 420px)',
    textAlign: 'left',
  },
  title: {
    fontSize: 'clamp(24px, 4vw, 36px)',
    color: '#a37a39',
    marginBottom: 'clamp(10px, 1.5vw, 16px)',
    fontWeight: '800',
  },
  category: {
    display: 'inline-block',
    background: '#a37a39',
    color: '#fff',
    padding: '4px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: 'clamp(12px, 2vw, 20px)',
  },
  price: {
    fontSize: 'clamp(22px, 3.5vw, 30px)',
    color: '#d4af37',
    fontWeight: '800',
    marginBottom: 'clamp(10px, 1.5vw, 16px)',
  },
  description: {
    fontSize: 'clamp(15px, 1.8vw, 18px)',
    color: '#ccc',
    lineHeight: 1.8,
    marginBottom: 'clamp(24px, 3vw, 36px)',
    maxWidth: '700px',
  },
  featuresBox: {
    marginBottom: 'clamp(20px, 3vw, 32px)',
  },
  featuresTitle: {
    fontSize: 'clamp(17px, 2.2vw, 20px)',
    color: '#d4af37',
    fontWeight: '700',
    marginBottom: 'clamp(10px, 1.5vw, 14px)',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    color: '#ddd',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    padding: '6px 0',
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bullet: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    minWidth: '8px',
    background: '#a37a39',
    borderRadius: '50%',
  },
  actions: {
    display: 'flex',
    gap: 'clamp(12px, 2vw, 20px)',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  btn: {
    background: '#a37a39',
    color: '#fff',
    border: 'none',
    padding: 'clamp(12px, 1.5vw, 14px) clamp(28px, 4vw, 40px)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: 'clamp(15px, 1.5vw, 17px)',
  },
  pdfBtn: {
    display: 'inline-block',
    background: 'transparent',
    color: '#d4af37',
    border: '2px solid #d4af37',
    padding: 'clamp(10px, 1.3vw, 12px) clamp(22px, 3vw, 32px)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: 'clamp(14px, 1.4vw, 16px)',
    textDecoration: 'none',
  },
};
