import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer style={styles.footer}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={styles.inner}>
        <motion.div style={styles.col}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h4 style={styles.heading}>
            <span style={styles.brandIcon}>&#9881;</span> PRO CNC MAROC
          </h4>
          <p style={styles.text}>
            The leading Moroccan company in digital engraving and laser cutting technology.
            We provide high-precision CNC and CO2 laser machines with free expert training
            and lifetime technical support.
          </p>
          <div style={styles.social}>
            <a href="https://www.facebook.com/profile.php?id=100078111407883" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M24 12a12 12 0 1 0-13.88 11.86v-8.39H7.08V12h3.04V9.62A4.23 4.23 0 0 1 14.6 5.1c.74 0 1.5.07 2.26.2V8.5h-1.28a2.6 2.6 0 0 0-2.93 2.04v.01h-.01v.89H16.5l-.45 3.47h-3.57v8.39A12 12 0 0 0 24 12"/></svg>
            </a>
            <a href="https://www.instagram.com/pro.cnc.maroc" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2.16c3.2 0 3.58.01 4.85.07a6.7 6.7 0 0 1 2.26.42 4.5 4.5 0 0 1 1.63 1.07 4.5 4.5 0 0 1 1.07 1.63 6.7 6.7 0 0 1 .42 2.26c.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85a6.7 6.7 0 0 1-.42 2.26 4.54 4.54 0 0 1-2.7 2.7 6.7 6.7 0 0 1-2.26.42c-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07a6.7 6.7 0 0 1-2.26-.42 4.5 4.5 0 0 1-1.63-1.07 4.5 4.5 0 0 1-1.07-1.63 6.7 6.7 0 0 1-.42-2.26C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85a6.7 6.7 0 0 1 .42-2.26 4.5 4.5 0 0 1 1.07-1.63A4.5 4.5 0 0 1 5.35 2.2a6.7 6.7 0 0 1 2.26-.42C8.88 1.72 9.26 1.71 12 1.71m0-1.55C8.74.16 8.33.17 7.04.23a8.25 8.25 0 0 0-2.75.53 6.07 6.07 0 0 0-2.2 1.43 6.07 6.07 0 0 0-1.43 2.2 8.25 8.25 0 0 0-.53 2.75C.17 8.33.16 8.74.16 12s.01 3.67.07 4.96a8.25 8.25 0 0 0 .53 2.75 6.18 6.18 0 0 0 3.63 3.63 8.25 8.25 0 0 0 2.75.53c1.29.06 1.7.07 4.96.07s3.67-.01 4.96-.07a8.25 8.25 0 0 0 2.75-.53 6.07 6.07 0 0 0 2.2-1.43 6.07 6.07 0 0 0 1.43-2.2 8.25 8.25 0 0 0 .53-2.75c.06-1.29.07-1.7.07-4.96s-.01-3.67-.07-4.96a8.25 8.25 0 0 0-.53-2.75 6.07 6.07 0 0 0-1.43-2.2 6.07 6.07 0 0 0-2.2-1.43 8.25 8.25 0 0 0-2.75-.53C15.67.17 15.26.16 12 .16m0 5.84a6 6 0 1 0 0 12 6 6 0 0 0 0-12m0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8m6.27-10.1a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8"/></svg>
            </a>
            <a href="https://www.tiktok.com/@pro.cnc.maroc" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.58 2.5 2.59 2.59 0 0 1-2.6-2.5 2.59 2.59 0 0 1 2.6-2.5c.26 0 .53.04.78.1V9.87a5.76 5.76 0 0 0-.78-.06A5.68 5.68 0 0 0 6.1 13.7a5.68 5.68 0 0 0 3.88 5.6 5.68 5.68 0 0 0 4.71-.54 5.68 5.68 0 0 0 2.4-4.05V8.27a7.46 7.46 0 0 0 4.43 1.43v-3.1a4.52 4.52 0 0 1-3.92-3.4z"/></svg>
            </a>
            <a href="https://youtube.com/@procncmaroc" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M23.5 6.19a3.03 3.03 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.03 3.03 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.03 3.03 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.03 3.03 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81M9.55 15.57V8.43L15.82 12z"/></svg>
            </a>
          </div>
        </motion.div>

        <motion.div style={styles.col}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/our-machines" style={styles.link}>Our Machines</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/about-us" style={styles.link}>About Us</Link>
          <Link to="/contact-us" style={styles.link}>Contact Us</Link>
          <Link to="/partner-map" style={styles.link}>Partner Map</Link>
          <Link to="/stories" style={styles.link}>Stories</Link>
        </motion.div>

       
        <motion.div style={styles.col}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <h4 style={styles.heading}>Contact Info</h4>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9906;</span>
            <span>PRO CNC MAROC, Casablanca, MOROCCO</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9993;</span>
            <span>contact.procncmaroc@gmail.com</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9742;</span>
            <span>+212 625 280 991</span>
            <a href="https://wa.me/212625280991" target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', marginLeft:'8px', color:'#25D366', textDecoration:'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9742;</span>
            <span>+212 667 198 564</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#128337;</span>
            <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
          </div>
          </motion.div>
      </div>

      <div style={styles.bottom}>
        <p style={styles.copy}>&copy; {new Date().getFullYear()} PRO CNC MAROC. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
    color: '#ccc',
    borderTop: '2px solid #a37a39',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 25%, 200px), 1fr))',
    gap: 'clamp(16px, 2vw, 28px)',
    padding: 'clamp(28px, 3vw, 44px) clamp(16px, 4vw, 60px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  heading: {
    color: '#d4af37',
    fontSize: 'clamp(13px, 1.2vw, 15px)',
    fontWeight: '800',
    marginBottom: 'clamp(6px, 0.6vw, 10px)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  brandIcon: {
    fontSize: 'clamp(14px, 1.4vw, 16px)',
    marginRight: '6px',
  },
  text: {
    fontSize: 'clamp(11px, 0.9vw, 13px)',
    lineHeight: 1.6,
    color: '#999',
    margin: 0,
  },
  social: {
    display: 'flex',
    gap: '8px',
    marginTop: 'clamp(6px, 0.8vw, 10px)',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(26px, 2.4vw, 32px)',
    height: 'clamp(26px, 2.4vw, 32px)',
    borderRadius: '50%',
    border: '1px solid #a37a39',
    color: '#a37a39',
    textDecoration: 'none',
    fontSize: 'clamp(10px, 0.9vw, 12px)',
    fontWeight: '700',
    transition: 'all 0.3s',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: 'clamp(11px, 0.9vw, 13px)',
    transition: 'color 0.2s',
    padding: '1px 0',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'clamp(11px, 0.9vw, 13px)',
    color: '#999',
  },
  contactIcon: {
    color: '#a37a39',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    minWidth: '16px',
  },
  bottom: {
    borderTop: '1px solid #222',
    padding: 'clamp(4px, 0.6vw, 8px)',
    textAlign: 'center',
  },
  copy: {
    color: '#555',
    fontSize: 'clamp(9px, 0.7vw, 10px)',
    margin: 0,
    letterSpacing: '0.5px',
  },
};