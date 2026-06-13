import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import machineBg from '../assets/machineBG.jpeg';
import api from '../api/axios';
import SEO from '../components/SEO';

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (!popup) return;
    const timer = setTimeout(() => setPopup(null), 3000);
    return () => clearTimeout(timer);
  }, [popup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        message: form.message,
      });
      setPopup('Thank you for your message! We will get back to you soon.');
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch {
      setPopup('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      <SEO title="Contact" description="Contactez PRO CNC MAROC pour toute question sur nos machines CNC, services d'usinage, découpe laser et gravure au Maroc." canonicalUrl="/contact-us" />
      {/* Hero Banner */}
      <motion.div
        style={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div style={styles.heroOverlay}>
          <motion.h1
            style={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            style={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Get in touch with our team
          </motion.p>
        </div>
      </motion.div>

      <div className="contact-grid" style={styles.content}>
        {/* Left - Contact Info + Form */}
        <motion.div
          style={styles.left}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="contact-info-row"
            style={styles.infoRow}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {[
              { icon: '☎', label: 'Phone', text: ['+212 625 280 991', '+212 667 198 564'] },
              { icon: '✉', label: 'Email', text: ['contact@procncmaroc.com'] },
              { icon: '📍', label: 'Address', text: ['CASABLANCA, Morocco'] },
            ].map((card, i) => (
              <motion.div
                key={i}
                style={styles.infoCard}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <span style={styles.infoIcon}>{card.icon}</span>
                <h4 style={styles.infoLabel}>{card.label}</h4>
                {card.text.map((t, j) => (
                  <p key={j} style={styles.infoText}>{t}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            style={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="contact-name-row" style={styles.nameRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <label style={styles.label}>Email *</label>
            <input
              type="email"
              style={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label style={styles.label}>Message *</label>
            <textarea
              style={styles.textarea}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />

            <button type="submit" style={{...styles.btn, opacity: sending ? 0.6 : 1}} disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </motion.div>

        {/* Right - Map */}
        <motion.div
          style={styles.right}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            style={styles.mapCard}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <h3 style={styles.mapTitle}>Our Location</h3>
            <div style={styles.mapWrap}>
              <iframe
                title="Google Map"
                src="https://maps.google.com/maps?q=33.5651338,-7.470498&hl=en&z=15&output=embed"
                width="100%"
                height="100%"
                style={styles.map}
                loading="lazy"
              />
            </div>
          </motion.div>
          <motion.div
            style={styles.hoursCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h4 style={styles.hoursTitle}>Working Hours</h4>
            <div style={styles.hoursRow}><span>Monday – Saturday</span><span>9:00 AM – 6:00 PM</span></div>
            <div style={styles.hoursRow}><span>Sunday</span><span>Closed</span></div>
          </motion.div>
        </motion.div>
      </div>

      {popup && (
        <motion.div
          style={styles.popupOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            style={styles.popup}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p style={styles.popupText}>{popup}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  hero: {
    height: 'clamp(160px, 25vw, 280px)',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: '900',
    color: '#d4af37',
    margin: 0,
    textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
  },
  heroSubtitle: {
    fontSize: 'clamp(16px, 2.5vw, 24px)',
    color: '#eee',
    marginTop: '8px',
    textShadow: '1px 1px 6px rgba(0,0,0,0.8)',
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(30px, 5vw, 60px) clamp(16px, 4vw, 60px)',
    display: 'grid',
    gap: 'clamp(30px, 4vw, 50px)',
    alignItems: 'start',
  },

  /* Left */
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(24px, 3vw, 36px)',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(12px, 1.5vw, 20px)',
  },
  infoCard: {
    background: 'linear-gradient(135deg, #111, #000)',
    border: '1px solid #a37a39',
    borderRadius: '8px',
    padding: 'clamp(14px, 2vw, 24px)',
    textAlign: 'center',
  },
  infoIcon: {
    fontSize: 'clamp(22px, 3vw, 30px)',
    color: '#d4af37',
  },
  infoLabel: {
    color: '#d4af37',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    margin: '8px 0 4px',
    fontWeight: '700',
  },
  infoText: {
    color: '#bbb',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    margin: 0,
  },

  form: {
    background: 'linear-gradient(135deg, #111, #000)',
    border: '1px solid #a37a39',
    borderRadius: '8px',
    padding: 'clamp(20px, 3vw, 36px)',
  },
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(10px, 1.5vw, 20px)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#d4af37',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
    fontWeight: '600',
    marginBottom: '6px',
    marginTop: 'clamp(12px, 1.5vw, 18px)',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: 'clamp(10px, 1.2vw, 14px)',
    borderRadius: '5px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    height: 'clamp(120px, 18vw, 180px)',
    padding: 'clamp(10px, 1.2vw, 14px)',
    borderRadius: '5px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  btn: {
    marginTop: 'clamp(16px, 2vw, 24px)',
    background: '#a37a39',
    border: 'none',
    color: '#fff',
    padding: 'clamp(12px, 1.5vw, 16px) clamp(28px, 4vw, 40px)',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    borderRadius: '5px',
    transition: 'background 0.3s',
  },

  /* Right */
  right: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(20px, 2.5vw, 30px)',
  },
  mapCard: {
    background: 'linear-gradient(135deg, #111, #000)',
    border: '1px solid #a37a39',
    borderRadius: '8px',
    padding: 'clamp(14px, 2vw, 20px)',
  },
  mapTitle: {
    color: '#d4af37',
    fontSize: 'clamp(16px, 1.8vw, 20px)',
    fontWeight: '700',
    margin: '0 0 clamp(12px, 1.5vw, 16px)',
  },
  mapWrap: {
    width: '100%',
    height: 'clamp(200px, 30vw, 320px)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  map: {
    border: 'none',
  },
  hoursCard: {
    background: 'linear-gradient(135deg, #111, #000)',
    border: '1px solid #a37a39',
    borderRadius: '8px',
    padding: 'clamp(14px, 2vw, 20px)',
  },
  hoursTitle: {
    color: '#d4af37',
    fontSize: 'clamp(16px, 1.8vw, 20px)',
    fontWeight: '700',
    margin: '0 0 clamp(10px, 1.2vw, 14px)',
  },
  hoursRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'clamp(13px, 1.2vw, 15px)',
    color: '#bbb',
    padding: 'clamp(6px, 0.8vw, 10px) 0',
    borderBottom: '1px solid #222',
  },
  popupOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)',
  },
  popup: {
    background: '#000',
    border: '2px solid #a37a39',
    borderRadius: '10px',
    padding: 'clamp(24px, 4vw, 40px)',
    maxWidth: '420px',
    margin: '0 16px',
    textAlign: 'center',
  },
  popupText: {
    color: '#fff',
    fontSize: 'clamp(15px, 1.8vw, 18px)',
    lineHeight: 1.6,
    margin: 0,
  },
};