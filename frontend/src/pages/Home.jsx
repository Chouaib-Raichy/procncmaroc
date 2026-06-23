import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import LazyVideo from '../components/LazyVideo';
import heroBg from '../assets/dq-1.webp';
const showroom = '/showroom.webp';
import placeholderImg from '../assets/placeholder.svg';
import bgWhyChooseUs from '../assets/bg_whychooseus.webp';
import fibreImg from '../assets/1.webp';
import laserImg from '../assets/2.webp';
import cncImg from '../assets/3.webp';
import mobile1Img from '../assets/mobile1.webp';
import mobile2Img from '../assets/mobile2.webp';
import mobile3Img from '../assets/mobile3.webp';
const showcase1 = '/videos/showcase1.mp4';
const showcase2 = '/videos/showcase2.mp4';
const showcase3 = '/videos/showcase3.mp4';
const showcaseBg = '/assets/showcase_bg.webp';
import {
  LuAward,
  LuDollarSign,
  LuShield,
  LuHeadphones,
} from "react-icons/lu";
import { getAllMachines } from '../api/machines';
import { getPartners } from '../api/partners';
import SEO from '../components/SEO';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [lightboxVideo, setLightboxVideo] = useState(null);
  const [partner, setPartner] = useState(null);
  const [catIndex, setCatIndex] = useState(0);

  const catCards = [
    { image: fibreImg, mobileImage: mobile1Img, title: 'FIBRE MARKING +', description: 'Durable & fast marking (titanium, acrylic, aluminum, gold, silver, brass...)' },
    { image: laserImg, mobileImage: mobile2Img, title: 'LASER CO2 +', description: 'Engraving & fine cutting (acrylic, wood, leather, paper, plastic...)' },
    { image: cncImg, mobileImage: mobile3Img, title: 'CNC ROUTER +', description: 'Precision & power (aluminum, acrylic, wood, pvc, aluminum composite, nylon...)' },
  ];

  useEffect(() => {
    getAllMachines()
      .then((res) => {
        setMachines(res.data);
      })
      .catch(() => setMachines([]));
  }, []);

  useEffect(() => {
    getPartners()
      .then((res) => {
        const users = res.data || res;
        if (users.length > 0) {
          setPartner(users[Math.floor(Math.random() * users.length)]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCatIndex((p) => (p + 1) % catCards.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const activeCat = catCards[catIndex];

  return (
    <div>
      <SEO title="Home" description="PRO CNC MAROC — Morocco's leading CNC machining, laser cutting, engraving &amp; 3D printing company. Premium machines for industry, crafts &amp; professionals. Visit our Casablanca showroom." canonicalUrl="/" keywords="CNC machines Morocco, precision machining, laser cutting, engraving services, 3D printing, CNC router, CNC Morocco, industrial machining" />
      <style>{`
        @media (max-width: 768px) {
          .hero-content { left: 5% !important; top: 9px !important; }
          .hero-title { font-size: 10px !important; margin-bottom: 14px !important; }
          .hero-tag { font-size: 8px !important; margin-bottom: 10px !important; }
          .hero-desc { font-size: 8px !important; display: block !important; }
          .hero-subtitle { margin: 0 !important; }
          .overlay-cards { top: 0 !important; bottom: 0 !important; transform: none !important; justify-content: center !important; align-items: stretch !important; flex-wrap: nowrap !important; gap: 36px !important; }
          .home-card { width: clamp(110px, 38vw, 220px) !important; height: 100% !important; }
          .home-card:last-child { display: flex !important; flex-direction: column !important; }
          .home-card img { height: 78% !important; }
          .carousel-img-wrap { flex: 1 1 auto !important; display: flex !important; min-height: 0 !important; }
          .carousel-img-wrap img { height: 100% !important; width: 100% !important; object-fit: fill !important; }
          .card-body { padding: 6px 4px 2px !important; }
          .home-card:last-child .card-body { flex: 0 0 auto !important; }
          .card-title { font-size: 7px !important; margin-bottom: 2px !important; }
          .card-text { font-size: 5.5px !important; margin-bottom: 2px !important; -webkit-line-clamp: 2 !important; }
          .card-location { font-size: 7px !important; margin-bottom: 2px !important; }
          .home-more-link { font-size: 6px !important; margin-top: 1px !important; padding: 2px 8px !important; }
        }
      `}</style>
      <motion.div style={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={heroBg} alt="" fetchpriority="high" style={styles.heroImg} />
        <div className="hero-content" style={styles.heroContent}>
            <motion.h1 className="hero-title" style={styles.heroTitle}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              PREMIUM CNC & LASER SOLUTIONS
            </motion.h1>
            <motion.p className="hero-subtitle" style={styles.heroSubtitle}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            >
              <span className="hero-tag" style={styles.heroTag}>High-performance machines</span>
              <span className="hero-desc" style={styles.heroDesc}>with free expert training & lifetime support</span>
            </motion.p>
        </div>
      </motion.div>

      <div style={styles.showroomSection}>
          <div className="overlay-cards" style={styles.overlayCards}>
            {/* LEFT CARD - PARTNER */}
            <motion.div style={styles.card} className="home-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {partner ? (
                <>
                  <img
                    src={partner.avatar_url || placeholderImg}
                    alt={partner.name}
                    loading="lazy"
                    style={styles.cardImg}
                  />
                  <div className="card-body" style={styles.cardBody}>
                    <h3 className="card-title" style={styles.cardTitle}>{partner.name}</h3>
                    <p className="card-text" style={styles.cardText}>
                      {partner.business_bio || partner.business_location || 'No information provided.'}
                    </p>
                    <hr style={styles.cardHr} />
                    <div className="card-location" style={styles.location}>
                      📍 {partner.city}{partner.city && partner.country ? ', ' : ''}{partner.country || ''}
                    </div>
                    <Link to={`/profile/${partner.id}`} style={styles.moreLink} className="home-more-link">More infos</Link>
                  </div>
                </>
              ) : (
                <div style={{ ...styles.cardImg, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '14px' }}>
                  Loading partner...
                </div>
              )}
            </motion.div>

            {/* RIGHT CARD - CATEGORY CAROUSEL */}
            <motion.div style={styles.card} className="home-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <div style={styles.carouselImgWrap} className="carousel-img-wrap">
                <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                  <source media="(max-width: 768px)" srcSet={activeCat.mobileImage} />
                  <img
                    src={activeCat.image}
                    alt={activeCat.title}
                    loading="lazy"
                    style={styles.carouselImg}
                  />
                </picture>
              </div>
              <div className="card-body" style={styles.cardBody}>
                <h3 className="card-title" style={{ ...styles.cardTitle, cursor: 'pointer' }} onClick={() => setCatIndex((p) => (p + 1) % catCards.length)}>{activeCat.title}</h3>
                <p className="card-text" style={{ ...styles.cardText, cursor: 'pointer' }} onClick={() => setCatIndex((p) => (p + 1) % catCards.length)}>{activeCat.description}</p>
                <div style={styles.dots}>
                  {catCards.map((_, i) => (
                    <span
                      key={i}
                      style={{ ...styles.dot, background: i === catIndex ? '#a37a39' : '#555' }}
                      onClick={() => setCatIndex(i)}
                    />
                  ))}
                </div>
                <Link to="/our-machines" style={styles.moreLink} className="home-more-link">More infos</Link>
              </div>
            </motion.div>

        </div>
        <img src={showroom} alt="Showroom" fetchpriority="high" style={styles.showroomImg} />
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
              <LazyVideo src={item.src} style={styles.showcaseVideo} />
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
              icon: <LuAward />,
              title: "Best Quality",
              text: "We have completed and achieved the Certificate of Quality Management System",
            },
            {
              icon: <LuDollarSign />,
              title: "Best Prices",
              text: "We guarantee the most competitive prices on the market without compromising on quality.",
            },
            {
              icon: <LuShield />,
              title: "Buyer Protection",
              text: "Shop with confidence through secure transactions and a satisfaction guarantee.",
            },
            {
              icon: <LuHeadphones />,
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
  heroImg: { width: '100%', height: 'auto', display: 'block', aspectRatio: '1004 / 259' },
  heroContent: {
    position: 'absolute',
    top: 'clamp(10px, 4vw, 80px)',
    left: '10%',
    textAlign: 'left',
    color: '#fff',
    maxWidth: 'clamp(200px, 40%, 600px)',
  },
  heroTitle: {
    fontSize: 'clamp(10px, 1.8vw, 22px)',
    fontWeight: '900',
    color: '#d4af37',
    textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
    marginBottom: 'clamp(12px, 2.5vw, 56px)',
    marginLeft: 0,
  },
  heroSubtitle: { margin: 0 },
  heroTag: {
    display: 'block',
    fontSize: 'clamp(7px, 1.2vw, 18px)',
    fontWeight: '700',
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    marginBottom: 'clamp(8px, 1.5vw, 32px)',
    marginLeft: 0,
  },
  heroDesc: {
    display: 'block',
    fontSize: 'clamp(6px, 1.1vw, 16px)',
    fontWeight: '700',
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    marginTop: 0,
    marginLeft: 0,
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
    background: '#000',
    padding: 'clamp(4px, 0.6vw, 10px)',
    boxSizing: 'border-box',
  },
  carouselImgWrap: {
    width: '100%',
    background: '#000',
    padding: 'clamp(4px, 0.6vw, 10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  carouselImg: {
    width: '100%',
    height: 'clamp(180px, 22vw, 240px)',
    objectFit: 'contain',
    display: 'block',
  },
  cardBody: {
    padding: '10px clamp(12px, 1.5vw, 20px) clamp(12px, 1.5vw, 20px)',
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
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
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
  showroomImg: { width: '100%', height: 'auto', display: 'block', aspectRatio: '1672 / 941' },

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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(16px, 2.5vw, 32px)',
    width: '100%',
    maxWidth: '1300px',
    margin: 'clamp(16px, 3vw, 32px) auto',
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
    aspectRatio: '16 / 9',
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
    fontSize: 'clamp(13px, 1.3vw, 17px)',
    lineHeight: 'clamp(1.7, 2, 2)',
    textAlign: 'center',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    fontStyle: 'italic',
    textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.4)',
    background: 'linear-gradient(135deg, rgba(163,122,57,0.05), transparent, rgba(163,122,57,0.05))',
    padding: 'clamp(16px, 3vw, 32px)',
    borderRadius: '16px',
    border: '1px solid rgba(163,122,57,0.1)',
  },
  videoLightbox: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.92)',
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
    padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 30px)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(160px, 40vw, 240px), 1fr))',
    gap: 'clamp(16px, 2.5vw, 24px)',
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
