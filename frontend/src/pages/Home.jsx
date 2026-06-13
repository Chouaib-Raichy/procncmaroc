import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../assets/dq-1.jpg';
import showroom from '../assets/showroom.png';
import ownerImg from '../assets/owner.png';
import cncRouterImg from '../assets/cnc-router.png';
import bgWhyChooseUs from '../assets/bg_whychooseus.png';
import showcase1 from '../assets/showcase1.mp4';
import showcase2 from '../assets/showcase2.mp4';
import showcase3 from '../assets/showcase3.mp4';
import showcaseBg from '../assets/showcase_bg.png';
import {
  FaAward,
  FaDollarSign,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import { getAllMachines } from '../api/machines';
import SEO from '../components/SEO';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [current, setCurrent] = useState(0);
  const [lightboxVideo, setLightboxVideo] = useState(null);

  useEffect(() => {
    getAllMachines()
      .then((res) => {
        setMachines(res.data);
        const grouped = {};
        res.data.forEach((m) => {
          const cat = m.category?.name || 'Uncategorized';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(m);
        });
        const picks = Object.values(grouped).map((list) => list[Math.floor(Math.random() * list.length)]);
        setFeatured(picks);
      })
      .catch(() => setMachines([]));
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % featured.length), 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const active = featured[current];

  return (
    <div>
      <SEO title="Home" description="PRO CNC MAROC — Your partner in CNC machines, precision machining, laser cutting, and engraving in Morocco. Professional solutions for industry and crafts." canonicalUrl="/" />
      <motion.div style={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={heroBg} alt="" style={styles.heroImg} />
        <div style={styles.heroContent}>
          <motion.h1 style={styles.heroTitle}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            PREMIUM CNC & LASER SOLUTIONS
          </motion.h1>
          <motion.p style={styles.heroSubtitle}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          >
            <span style={styles.heroTag}>High-performance machines</span>
            <span style={styles.heroDesc}>with free expert training & lifetime support</span>
          </motion.p>
        </div>
      </motion.div>

      <div style={styles.showroomSection}>
        <div style={styles.overlayCards}>
          {/* LEFT CARD */}
          <motion.div style={styles.card} className="home-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <img src={ownerImg} alt="Mr Azeddine" style={styles.cardImg} />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>Mr AZEDDINE Mouhcine</h3>
              <p style={styles.cardText}>
                CNC & laser cutting workshop, manufacturer of facade panels,
                carpentry and interior design.
              </p>
              <hr style={styles.cardHr} />
              <div style={styles.location}>📍 EL JADIDA - MOROCCO</div>
              <a href="/about" style={styles.moreLink} className="home-more-link">More infos</a>
            </div>
          </motion.div>

          {/* RIGHT CARD - MACHINE CAROUSEL */}
          <motion.div style={styles.card} className="home-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <div style={styles.carouselImgWrap}>
              {active ? (
                <img
                  src={active.image_url || 'https://placehold.co/400x250/333/fff?text=Machine'}
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
              {featured.length > 1 && (
                <div style={styles.dots}>
                  {featured.map((_, i) => (
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
          </motion.div>

        </div>
        <img src={showroom} alt="Showroom" style={styles.showroomImg} />
      </div>

      <section style={styles.showcase}>
        <div style={styles.showcaseGlow} />
        <motion.div
          style={styles.showcaseDecoLine}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.h2
          style={styles.showcaseTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          RAYSET HIGH PRODUCTION CAPABILITY SHOWCASE
        </motion.h2>
        <div style={styles.showcaseVideos}>
          {[
            { src: showcase1, label: 'RAYSET laser co2 machines' },
            { src: showcase2, label: 'RAYSET fiber marking machines' },
            { src: showcase3, label: 'RAYSET cnc router machines' },
          ].map((item, i) => (
            <motion.div
              key={i}
              style={styles.showcaseVideoWrap}
              className="showcase-video-wrap"
              onClick={() => setLightboxVideo(item.src)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <video src={item.src} style={styles.showcaseVideo} autoPlay muted loop playsInline />
              <div style={styles.showcaseOverlay}>
                <div style={styles.showcaseOverlayContent} className="showcase-overlay-content">
                  <motion.span
                    style={styles.showcasePlayIcon}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ▶
                  </motion.span>
                  <span style={styles.showcaseLabel}>Click to play</span>
                </div>
                <div style={styles.showcaseLabelBar}>
                  <span style={styles.showcaseLabelBarText}>{item.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          style={styles.showcaseText}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        >
          Pro CNC Morocco is the leading Moroccan company in digital engraving and laser cutting technology,
          distinguished by its unwavering commitment to its partners. We are the only providers of free
          professional training and lifetime free technical support.<br /><br />
          We also specialize in providing original, certified, high-quality machines, carefully selected to
          ensure high performance and durability. Because our clients are not just customers, they are our
          lifelong partners. We don't just sell a service; we are committed to continuously supporting you
          to ensure your success.
        </motion.p>
        <motion.div
          style={styles.showcaseDecoLine}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        />
      </section>

      <section style={styles.features}>
        <motion.h2 style={styles.sectionTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >Why Choose PRO CNC MAROC</motion.h2>
        <div style={styles.whyChooseGrid}>
          {[
            {
              icon: <FaAward />,
              title: "Best Quality",
              text: "We have completed and achieved the Certificate of Quality Management System",
            },
            {
              icon: <FaDollarSign />,
              title: "Best Prices",
              text: "We guarantee the most competitive prices on the market without compromising on quality.",
            },
            {
              icon: <FaShieldAlt />,
              title: "Buyer Protection",
              text: "Shop with confidence through secure transactions and a satisfaction guarantee.",
            },
            {
              icon: <FaHeadset />,
              title: "24/7 Customer Support",
              text: "Our team is available anytime to answer your questions and assist you.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              style={styles.whyChooseItem}
              className="why-choose-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
            >
              <div style={styles.whyChooseIcon} className="why-choose-icon">
                {item.icon}
              </div>
              <h3 style={styles.whyChooseTitle}>{item.title}</h3>
              <p style={styles.whyChooseText}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightboxVideo && (
          <motion.div
            style={styles.videoLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxVideo(null)}
          >
            <motion.video
              src={lightboxVideo}
              style={styles.videoLightboxMedia}
              autoPlay
              muted
              loop
              playsInline
              controls
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
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

  showcase: {
    padding: 'clamp(30px, 4vw, 50px) clamp(16px, 4vw, 60px)',
    background: `linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)), url(${showcaseBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative',
    overflow: 'hidden',
    borderTop: '1px solid rgba(163,122,57,0.12)',
    borderBottom: '1px solid rgba(163,122,57,0.12)',
  },
  showcaseGlow: {
    position: 'absolute',
    top: '-30%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(163,122,57,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  showcaseDecoLine: {
    width: 'clamp(60px, 10vw, 120px)',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #a37a39, transparent)',
    margin: '0 auto',
  },
  showcaseTitle: {
    textAlign: 'center',
    fontSize: 'clamp(20px, 2.8vw, 34px)',
    color: '#a37a39',
    fontWeight: '900',
    margin: 'clamp(12px, 2vw, 20px) 0',
    letterSpacing: '3px',
    textShadow: '0 2px 20px rgba(163,122,57,0.2), 0 2px 8px rgba(0,0,0,0.5)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  showcaseVideos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 'clamp(20px, 2.5vw, 32px)',
    width: '100%',
    maxWidth: '1300px',
    margin: 'clamp(20px, 3vw, 32px) auto',
  },
  showcaseVideoWrap: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(163,122,57,0.4)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(163,122,57,0.2)',
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
    cursor: 'pointer',
    width: '100%',
    maxHeight: '320px',
  },
  showcaseVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: 'inherit',
    outline: 'none',
    background: '#000',
  },
  showcaseOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  showcaseOverlayContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: 1,
  },
  showcaseLabelBar: {
    background: 'rgba(0,0,0,0.6)',
    padding: 'clamp(8px, 1vw, 12px) clamp(12px, 2vw, 20px)',
    textAlign: 'center',
  },
  showcaseLabelBarText: {
    color: '#a37a39',
    fontSize: 'clamp(12px, 1.2vw, 15px)',
    fontWeight: 700,
    letterSpacing: '1px',
    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
  },
  showcasePlayIcon: {
    color: '#a37a39',
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 900,
    textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 40px rgba(145, 109, 52, 0.3)',
    opacity: 0.8,
  },
  showcaseLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 'clamp(11px, 1vw, 13px)',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  showcaseText: {
    width: '100%',
    margin: 'clamp(16px, 3vw, 32px) auto 0',
    color: '#ffffff',
    opacity: 1,
    fontSize: 'clamp(14px, 1.3vw, 17px)',
    lineHeight: 2,
    textAlign: 'center',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    fontStyle: 'italic',
    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.4)',
    background: 'linear-gradient(135deg, rgba(163,122,57,0.05), transparent, rgba(163,122,57,0.05))',
    padding: 'clamp(20px, 3vw, 32px)',
    borderRadius: '16px',
    border: '1px solid rgba(163,122,57,0.1)',
  },
  videoLightbox: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(226, 204, 0, 0.92)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  videoLightboxMedia: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '12px',
    outline: 'none',
    cursor: 'default',
  },

  features: {
    padding: '40px 30px',
    background: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${bgWhyChooseUs})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 'clamp(22px, 3vw, 30px)',
    color: '#d4af37',
    marginBottom: '36px',
    fontWeight: '800',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
  },
  whyChooseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  whyChooseItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  whyChooseIcon: {
    fontSize: '36px',
    color: '#d4af37',
  },
  whyChooseTitle: {
    color: '#d4af37',
    fontSize: '17px',
    fontWeight: '700',
    margin: 0,
    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
  },
  whyChooseText: {
    color: '#d8d8d8',
    lineHeight: '1.6',
    fontSize: '13px',
    margin: 0,
    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
  },
};
