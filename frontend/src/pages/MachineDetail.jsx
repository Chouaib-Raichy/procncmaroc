import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import machineBg from '../assets/machineBG.webp';
import placeholderImg from '../assets/placeholder.svg';
import SEO from '../components/SEO';
import slugify from '../utils/slugify';

const PHONE = '212625280991';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const btnAnim = {
  whileHover: { scale: 1.05, boxShadow: '0 0 20px rgba(163,122,57,0.5)' },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 15 },
};

export default function MachineDetail() {
  const { slugAndId, id: paramId } = useParams();
  const id = paramId || (slugAndId ? slugAndId.split('-').pop() : null);
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = () => {
    setLoading(true);
    setError(null);
    api.get(`/machines/${id}`)
      .then((res) => setMachine(res.data?.data || res.data))
      .catch(() => setError('Failed to load machine details. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi, I'm interested in the "${machine.title}"${machine.price ? ` (${machine.price} MAD)` : ''}. Can you provide more information?`
    );
    window.open(`https://wa.me/${PHONE}?text=${text}`, '_blank');
  };

  if (loading) return <><SEO title="Machine | PRO CNC MAROC" /><Loading text="Loading machine..." /></>;

  if (error) return <><SEO title="Machine | PRO CNC MAROC" /><ErrorState message={error} onRetry={fetch} /></>;

  if (!machine) {
    return (
      <div style={styles.page}>
        <SEO title="Machine | PRO CNC MAROC" />
        <div style={styles.overlay}>
          <div style={styles.center}>
            <h2 style={{ color: '#fff' }}>Machine not found</h2>
            <Link to="/our-machines" style={{ color: '#a37a39', display: 'inline-block', marginTop: '12px' }}>Back to Machines</Link>
          </div>
        </div>
      </div>
    );
  }

  const machineSlug = slugify(machine.title);
  const machineUrl = `/machines/${machineSlug}-${id}`;
  const machineFullUrl = `https://www.procncmaroc.com${machineUrl}`;

  return (
    <div style={styles.page}>
      <SEO title={machine.title} description={machine.description + ' — Available at PRO CNC MAROC in Morocco. Call +212625280991 for pricing &amp; demo.'} canonicalUrl={machineUrl} ogImage={machine.image_url || undefined} ogType="product" keywords={machine.title + ', CNC machine Morocco, ' + (machine.category?.name || 'CNC') + ' Morocco, buy CNC Morocco'} breadcrumbs={[
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.procncmaroc.com' },
        { '@type': 'ListItem', position: 2, name: 'Our Machines', item: 'https://www.procncmaroc.com/our-machines' },
        { '@type': 'ListItem', position: 3, name: machine.title, item: machineFullUrl },
      ]} jsonLd={{
        '@type': 'Product',
        name: machine.title,
        description: machine.description,
        image: machine.image_url || undefined,
        offers: machine.price ? {
          '@type': 'Offer',
          price: parseFloat(machine.price),
          priceCurrency: 'MAD',
          availability: 'https://schema.org/InStock',
          url: machineFullUrl,
          seller: { '@type': 'Organization', name: 'PRO CNC MAROC' },
        } : undefined,
        category: machine.category?.name || undefined,
        brand: { '@type': 'Brand', name: 'PRO CNC MAROC' },
      }} />
      <div style={styles.overlay}>
        <div style={styles.inner}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link to="/our-machines" className="back-link" style={{
              color: '#d4af37', textDecoration: 'none', fontSize: '13px', display: 'inline-flex',
              alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 600,
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              padding: '6px 16px 6px 10px', borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(163,122,57,0.15), rgba(212,175,55,0.08))',
              border: '1px solid rgba(212,175,55,0.3)',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #a37a39, #d4af37)',
                color: '#000', fontSize: '13px', lineHeight: 1, fontWeight: 900, flexShrink: 0,
              }}>&#8617;</span>
              Back
            </Link>
          </motion.div>

          <div style={styles.content}>
            <motion.div
              style={styles.imageWrap}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={machine.image_url || machineBg}
                alt={machine.title}
                loading="lazy"
                style={styles.image}
              />
            </motion.div>

            <motion.div
              style={styles.info}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={childVariants} style={styles.title}>{machine.title}</motion.h1>
              {machine.category && (
                <motion.span variants={childVariants} style={styles.category}>{machine.category.name}</motion.span>
              )}
              {machine.price && (
                <motion.p variants={childVariants} style={styles.price}>{parseFloat(machine.price).toLocaleString()} MAD</motion.p>
              )}
              <motion.p variants={childVariants} style={styles.description}>{machine.description}</motion.p>

              {machine.features && machine.features.length > 0 && (
                <motion.div variants={childVariants} style={styles.featuresBox}>
                  <h2 style={styles.featuresTitle}>Exclusive Features :</h2>
                  <ul style={styles.featuresList}>
                    {machine.features.map((f, i) => (
                      <li key={i} style={styles.featureItem}><span style={styles.bullet}></span>{f}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.div variants={childVariants} style={styles.actions}>
                {machine.pdf_url && (
                  <motion.a href={machine.pdf_url} target="_blank" rel="noopener noreferrer" style={styles.pdfBtn} {...btnAnim}>
                    Technical Specs (PDF)
                  </motion.a>
                )}
                <motion.button onClick={openWhatsApp} style={styles.btn} {...btnAnim}>
                  &#128172; Inquire on WhatsApp
                </motion.button>
              </motion.div>
            </motion.div>
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
    fontSize: '15px',
  },
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.7)',
    padding: 'clamp(16px, 2.5vw, 30px) clamp(14px, 3.5vw, 50px)',
  },
  inner: {
    maxWidth: '1050px',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    gap: 'clamp(18px, 3vw, 32px)',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  imageWrap: {
    flex: '1 1 clamp(300px, 42vw, 500px)',
    borderRadius: '7px',
    overflow: 'hidden',
    border: '2.5px solid #a37a39',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  info: {
    flex: '1 1 clamp(250px, 34vw, 400px)',
    textAlign: 'left',
  },
  title: {
    fontSize: 'clamp(20px, 3vw, 28px)',
    color: '#a37a39',
    marginBottom: '8px',
    fontWeight: '750',
  },
  category: {
    display: 'inline-block',
    background: '#a37a39',
    color: '#fff',
    padding: '3px 15px',
    borderRadius: '18px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  price: {
    fontSize: 'clamp(18px, 3vw, 26px)',
    color: '#d4af37',
    fontWeight: '750',
    marginBottom: '10px',
  },
  description: {
    fontSize: 'clamp(14px, 1.6vw, 16px)',
    color: '#ccc',
    lineHeight: 1.75,
    marginBottom: '20px',
  },
  featuresBox: {
    marginBottom: '18px',
  },
  featuresTitle: {
    fontSize: 'clamp(15px, 1.8vw, 18px)',
    color: '#d4af37',
    fontWeight: '650',
    marginBottom: '8px',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    color: '#ddd',
    fontSize: 'clamp(13px, 1.4vw, 15px)',
    padding: '4px 0',
    lineHeight: 1.45,
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  },
  bullet: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    minWidth: '7px',
    background: '#a37a39',
    borderRadius: '50%',
  },
  actions: {
    display: 'flex',
    gap: 'clamp(10px, 1.8vw, 16px)',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  btn: {
    background: '#a37a39',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '5px',
    fontWeight: '650',
    cursor: 'pointer',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
  },
  pdfBtn: {
    display: 'inline-block',
    background: 'transparent',
    color: '#d4af37',
    border: '1.5px solid #d4af37',
    padding: '9px 22px',
    borderRadius: '5px',
    fontWeight: '650',
    cursor: 'pointer',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    textDecoration: 'none',
  },
};
