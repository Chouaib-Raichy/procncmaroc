import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.col}>
          <h4 style={styles.heading}>
            <span style={styles.brandIcon}>&#9881;</span> PRO CNC MAROC
          </h4>
          <p style={styles.text}>
            The leading Moroccan company in digital engraving and laser cutting technology.
            We provide high-precision CNC and CO2 laser machines with free expert training
            and lifetime technical support.
          </p>
          <div style={styles.social}>
            <a href="#" style={styles.socialIcon} aria-label="Facebook">f</a>
            <a href="#" style={styles.socialIcon} aria-label="Instagram">&#9679;</a>
            <a href="#" style={styles.socialIcon} aria-label="LinkedIn">in</a>
            <a href="#" style={styles.socialIcon} aria-label="YouTube">&#9654;</a>
          </div>
        </div>

        <div style={styles.col}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/our-machines" style={styles.link}>Our Machines</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/about-us" style={styles.link}>About Us</Link>
          <Link to="/contact-us" style={styles.link}>Contact Us</Link>
          <Link to="/partner-map" style={styles.link}>Partner Map</Link>
        </div>

       
        <div style={styles.col}>
          <h4 style={styles.heading}>Contact Info</h4>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9906;</span>
            <span>EL JADIDA, Morocco</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9993;</span>
            <span>contact@procncmaroc.com</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#9742;</span>
            <span>+212 XXXXXXXXX</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>&#128337;</span>
            <span>Mon–Sat: 8:00 AM – 6:00 PM</span>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={styles.copy}>&copy; {new Date().getFullYear()} PRO CNC MAROC. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
    color: '#ccc',
    borderTop: '3px solid #a37a39',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(180px, 30%, 260px), 1fr))',
    gap: 'clamp(24px, 3vw, 40px)',
    padding: 'clamp(40px, 5vw, 70px) clamp(16px, 4vw, 60px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(6px, 0.8vw, 10px)',
  },
  heading: {
    color: '#d4af37',
    fontSize: 'clamp(15px, 1.5vw, 18px)',
    fontWeight: '800',
    marginBottom: 'clamp(8px, 1vw, 14px)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  brandIcon: {
    fontSize: 'clamp(16px, 1.8vw, 20px)',
    marginRight: '6px',
  },
  text: {
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    lineHeight: 1.7,
    color: '#999',
    margin: 0,
  },
  social: {
    display: 'flex',
    gap: '10px',
    marginTop: 'clamp(10px, 1.5vw, 16px)',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(32px, 3vw, 38px)',
    height: 'clamp(32px, 3vw, 38px)',
    borderRadius: '50%',
    border: '1px solid #a37a39',
    color: '#a37a39',
    textDecoration: 'none',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    fontWeight: '700',
    transition: 'all 0.3s',
  },
  link: {
    color: '#999',
    textDecoration: 'none',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    transition: 'color 0.2s',
    padding: '2px 0',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    color: '#999',
  },
  contactIcon: {
    color: '#a37a39',
    fontSize: 'clamp(14px, 1.3vw, 16px)',
    minWidth: '18px',
  },
  bottom: {
    borderTop: '1px solid #222',
    padding: 'clamp(14px, 2vw, 20px)',
    textAlign: 'center',
  },
  copy: {
    color: '#555',
    fontSize: 'clamp(11px, 1vw, 13px)',
    margin: 0,
    letterSpacing: '0.5px',
  },
};