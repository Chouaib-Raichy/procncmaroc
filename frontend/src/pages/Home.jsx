import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/dq-1.jpg';
import showroom from '../assets/showroom.png';
import ownerImg from '../assets/owner.png';
import cncRouterImg from '../assets/cnc-router.png';
import { getAllMachines, getImageUrl } from '../api/machines';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getAllMachines()
      .then((res) => setMachines(res.data))
      .catch(() => setMachines([]));
  }, []);

  useEffect(() => {
    if (machines.length === 0) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % machines.length), 4000);
    return () => clearInterval(timer);
  }, [machines.length]);

  const active = machines[current];

  return (
    <div>
      <div style={styles.hero}>
        <img src={heroBg} alt="" style={styles.heroImg} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>PREMIUM CNC & LASER SOLUTIONS</h1>
          <p style={styles.heroSubtitle}>
            <span style={styles.heroTag}>High-performance machines</span>
            <span style={styles.heroDesc}>with free expert training & lifetime support</span>
          </p>
        </div>
      </div>

      <div style={styles.showroomSection}>
        <div style={styles.overlayCards}>
          {/* LEFT CARD */}
          <div style={styles.card} className="home-card">
            <img src={ownerImg} alt="Mr Azeddine" style={styles.cardImg} />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>Mr AZEDDINE Mouchine</h3>
              <p style={styles.cardText}>
                CNC & laser cutting workshop, manufacturer of facade panels,
                carpentry and interior design.
              </p>
              <hr style={styles.cardHr} />
              <div style={styles.location}>📍 EL JADIDA - MOROCCO</div>
              <a href="/about" style={styles.moreLink} className="home-more-link">More infos</a>
            </div>
          </div>

          {/* RIGHT CARD - MACHINE CAROUSEL */}
          <div style={styles.card} className="home-card">
            <div style={styles.carouselImgWrap}>
              {active ? (
                <img
                  src={getImageUrl(active.image) || 'https://placehold.co/400x250/333/fff?text=Machine'}
                  alt={active.title}
                  style={styles.carouselImg}
                />
              ) : (
                <div style={{ ...styles.cardImg, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '14px' }}>
                  No machines
                </div>
              )}
            </div>
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{active ? active.title : 'Our Machines'}</h3>
              <p style={styles.cardText}>
                {active ? active.description : 'Browse our full range of CNC and laser machines.'}
              </p>
              {machines.length > 1 && (
                <div style={styles.dots}>
                  {machines.map((_, i) => (
                    <span
                      key={i}
                      style={{ ...styles.dot, background: i === current ? '#a37a39' : '#555' }}
                      onClick={() => setCurrent(i)}
                    />
                  ))}
                </div>
              )}
              <Link to="/our-machines" style={styles.moreLink} className="home-more-link">More infos</Link>
            </div>
          </div>
        </div>

        <img src={showroom} alt="Showroom" style={styles.showroomImg} />
      </div>

      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose PRO CNC MAROC</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: '🔧', title: 'Premium Quality', text: 'High-precision machines built with industrial-grade components' },
            { icon: '🌍', title: 'Worldwide Delivery', text: 'Shipping and installation support across Morocco and beyond' },
            { icon: '💪', title: 'Expert Support', text: 'Dedicated technical support and training for all our machines' },
            { icon: '⚡', title: 'Innovation', text: 'Cutting-edge technology with continuous R&D investment' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard} className="feature-card">
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const cardWidth = 'clamp(260px, 30vw, 340px)';

const styles = {
  hero: { position: 'relative', lineHeight: 0 },
  heroImg: { width: '100%', height: 'auto', display: 'block' },
  heroContent: {
    position: 'absolute',
    top: 'clamp(20px, 4vw, 60px)',
    left: 'clamp(16px, 4vw, 50px)',
    textAlign: 'left',
    color: '#fff',
    maxWidth: 'clamp(280px, 50%, 600px)',
  },
  heroTitle: {
    fontSize: 'clamp(22px, 2vw, 0px)',
    fontWeight: '900',
    color: '#d4af37',
    textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
    marginBottom: 'clamp(40px, 3vw, 16px)',
    marginLeft: '120px',
  },
  heroSubtitle: { margin: 0 },
  heroTag: {
    display: 'block',
    fontSize: 'clamp(16px, 2.5vw, 18px)',
    fontWeight: '700',
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    marginBottom: 'clamp(25px, 3vw, 16px)',
    marginLeft: '120px',
  },
  heroDesc: {
    display: 'block',
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontWeight: '700',
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    marginTop: 'clamp(6px, 1vw, 12px)',
    marginLeft: '120px',
  },

  showroomSection: { position: 'relative', lineHeight: 0 },
  overlayCards: {
    position: 'absolute',
    top: 'clamp(50px, 6vw, 80px)',
    left: 0,
    right: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 clamp(16px, 4vw, 60px)',
    flexWrap: 'wrap',
  },
  card: {
    width: cardWidth,
    background: '#000',
    border: '2px solid #a37a39',
    borderRadius: '8px',
    overflow: 'hidden',
    color: '#fff',
    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImg: {
    width: '100%',
    height: 'clamp(180px, 22vw, 240px)',
    objectFit: 'cover',
    display: 'block',
  },
  carouselImgWrap: { width: '100%', background: '#000' },
  carouselImg: {
    width: '100%',
    height: 'clamp(180px, 22vw, 240px)',
    objectFit: 'contain',
    display: 'block',
  },
  cardBody: {
    padding: 'clamp(12px, 1.5vw, 20px)',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardTitle: {
    color: '#d4af37',
    fontSize: 'clamp(18px, 2vw, 20px)',
    marginBottom: 'clamp(12px, 1.8vw, 20px)',
    fontWeight: 'bold',
  },
  cardText: {
    color: '#ddd',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    lineHeight: 1.6,
    marginBottom: 'clamp(8px, 1vw, 12px)',
    flex: 1,
  },
  location: {
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    marginBottom: 'clamp(10px, 1.5vw, 16px)',
  },
  cardHr: {
    border: 'none',
    borderTop: '1px solid #a37a39',
    margin: 'clamp(8px, 1vw, 12px) 0',
  },
  dots: {
    display: 'flex',
    gap: '6px',
    marginBottom: 'clamp(8px, 1vw, 12px)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: '0.3s',
  },
  moreLink: {
    alignSelf: 'flex-end',
    marginTop: 'clamp(4px, 0.5vw, 8px)',
  },
  showroomImg: { width: '100%', height: 'auto', display: 'block' },

  features: {
    padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 40px)',
    background: 'linear-gradient(180deg, #000, #0a0a0a, #000)',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 'clamp(28px, 4vw, 40px)',
    color: '#d4af37',
    marginBottom: 'clamp(30px, 5vw, 50px)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: 'clamp(16px, 3vw, 30px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'linear-gradient(135deg, #111, #1a1a1a, #111)',
    padding: 'clamp(24px, 4vw, 40px) clamp(20px, 3vw, 30px)',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
    border: '1px solid #a37a39',
  },
  featureIcon: { fontSize: 'clamp(36px, 5vw, 48px)', marginBottom: 'clamp(12px, 2vw, 20px)' },
  featureTitle: {
    fontSize: 'clamp(18px, 2.2vw, 22px)',
    color: '#d4af37',
    marginBottom: 'clamp(10px, 1.5vw, 15px)',
  },
  featureText: { color: '#ccc', lineHeight: 1.6, fontSize: 'clamp(13px, 1.3vw, 15px)' },
};
