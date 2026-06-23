import { useState } from 'react';
import { motion } from 'framer-motion';
import machineBg from '../assets/machineBG.jpeg';
import about from '../assets/about.jpg';
import premiumIcon from '../assets/premium-icon.svg';
import SEO from '../components/SEO';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AboutUs() {
  const [visitors] = useState(() => rand(11000, 13000));
  const [orders] = useState(() => rand(20, 50));
  const [completed] = useState(() => rand(2, 5));
  return (
    <div style={styles.page} className="about-page">
      <SEO title="About Us — CNC Experts in Morocco" description="PRO CNC MAROC — Trusted CNC machining &amp; laser cutting experts in Casablanca, Morocco since 2024. We deliver precision, quality &amp; innovation for industrial &amp; craft projects across Morocco &amp; beyond." canonicalUrl="/about-us" keywords="about PRO CNC MAROC, CNC company Morocco, CNC Casablanca, machining experts Morocco" />
      <style>{`@media (max-width: 768px) { .about-page { overflow-x: hidden !important; } }`}</style>
      <div style={styles.overlay}>
        <section style={styles.container}>
            <motion.div
              style={styles.imageContainer}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <img src={about} alt="About" style={styles.image} />
          </motion.div>

          <div style={styles.content}>
            <motion.h1
              style={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We Are Expert In All
              CNC Machines
            </motion.h1>

            <motion.p
              style={styles.description}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              PRO CNC MAROC is the leading Moroccan company in digital engraving
              and laser cutting technology, distinguished by its unwavering
              commitment to its partners.
            </motion.p>

            <motion.p
              style={styles.description}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              We are the only providers of free professional training and lifetime
              free technical support, we also specialize in providing original,
              certified, high-quality machines, carefully selected to ensure high
              performance and durability.
            </motion.p>

            <motion.p
              style={styles.description}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              Because our clients are not just customers, they are our lifelong
              partners, we don't just sell a service; we are committed to
              continuously supporting you to ensure your success.
            </motion.p>

            <motion.div
              style={styles.stats}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                style={styles.statItem}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2 style={styles.number}>{visitors}</h2>
                <p style={styles.label}>Online visitors</p>
              </motion.div>

              <motion.div
                style={styles.statItem}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2 style={styles.number}>{orders}</h2>
                <p style={styles.label}>Orders in progress</p>
              </motion.div>

              <motion.div
                style={styles.statItem}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2 style={styles.number}>{completed}</h2>
                <p style={styles.label}>Completed today</p>
              </motion.div>
            </motion.div>

            <motion.div
              style={styles.feature}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div style={styles.icon}>
                <img src={premiumIcon} alt="Premium" style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>

              <div>
                <h3 style={styles.featureTitle}>Premium Machinery</h3>

                <p style={styles.featureText}>
                  Our machinery is fully certified to meet the highest global
                  standards for safety, precision, and heavy-duty industrial
                  performance.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
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
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
    minHeight: "100vh",
    padding: "60px",
    flexWrap: "wrap",
    maxWidth: '1200px',
    margin: '0 auto',
  },

  imageContainer: {
    flex: 1,
    minWidth: "400px",
    maxWidth: "1200px",
    border: "3px solid #a37a39",
    borderRadius: "8px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  content: {
    flex: 1,
    minWidth: "350px",
    color: "#fff",
  },

  title: {
    fontSize: "clamp(26px,3vw,27px)",
    fontWeight: "800",
    color: "#c7984e",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  description: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#ffffff",
    marginBottom: "18px",
  },

  stats: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
    marginBottom: "30px",
    gap: "clamp(24px, 5vw, 60px)",
    flexWrap: "wrap",
  },

  statItem: {
    textAlign: "center",
  },

  number: {
    fontSize: "36px",
    color: "#c7984e",
    fontWeight: "700",
    margin: 0,
  },

  label: {
    color: "#888",
    fontSize: "14px",
    marginTop: "8px",
  },

  feature: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },

  icon: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    background: "radial-gradient(circle at 40% 35%, #1a1a1a, #000)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px",
  },

  featureTitle: {
    color: "#c7984e",
    fontSize: "22px",
    marginBottom: "8px",
  },

  featureText: {
    color: "#999",
    fontSize: "14px",
    lineHeight: "1.6",
  },
};