import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { getProducts } from '../api/products';

const WHATSAPP_NUMBER = '+212625280991';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.124-1.003-1.87-2.242-2.09-2.621-.222-.38-.024-.585.163-.772.166-.166.373-.434.56-.651.185-.218.247-.373.37-.622.123-.249.062-.467-.03-.652-.092-.186-.67-1.614-.918-2.21-.242-.579-.487-.48-.67-.489-.174-.009-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.71.307 1.264.49 1.695.627.713.227 1.362.195 1.875.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.302.652 4.457 1.785 6.3L.69 23.1l5.085-1.036A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.86 0-3.635-.54-5.148-1.557l-.37-.222-3.016.614.807-2.943-.24-.383A9.54 9.54 0 0 1 2.4 12c0-5.302 4.298-9.6 9.6-9.6s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z" /></svg>
);

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);

function formatPrice(price) {
  if (price == null) return null;
  return Number(price).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MAD';
}

function truncate(text, len = 100) {
  if (!text || text.length <= len) return text || '';
  return text.slice(0, len).trimEnd() + '...';
}

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: 'easeOut' } });

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' } }),
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = { page, per_page: 9 };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    getProducts(params)
      .then((res) => {
        const d = res.data;
        setProducts(d.data ?? d);
        setTotalPages(d.last_page ?? 1);
        setTotal(d.total ?? 0);
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div style={styles.page}>
      <SEO title="Products" description="PRO CNC MAROC — Premium CNC products &amp; services in Morocco. Precision machining, laser cutting, engraving, 3D printing &amp; industrial maintenance. Quality guaranteed." canonicalUrl="/products" keywords="CNC products Morocco, machining services, laser cutting service, 3D printing service, metal fabrication Morocco" jsonLd={{ '@type': 'ItemList', name: 'Products', itemListElement: [] }} />
      <div style={styles.overlay}>
        <div style={styles.header}>
          <motion.h1 style={styles.title} {...fadeUp()}>Products</motion.h1>
          <motion.p style={styles.subtitle} {...fadeUp(0.1)}>Professional CNC equipment and accessories</motion.p>
        </div>

        <motion.div style={styles.searchWrap} {...fadeUp(0.15)}>
          <div style={styles.searchInner}>
            <span style={styles.searchIcon}><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div style={styles.grid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={styles.skeleton}>
                <div style={styles.skelImg} />
                <div style={{ padding: '16px' }}>
                  <div style={{ ...styles.skelLine, width: '70%', height: '18px', marginBottom: '10px' }} />
                  <div style={{ ...styles.skelLine, width: '40%', height: '14px', marginBottom: '12px' }} />
                  <div style={{ ...styles.skelLine, width: '90%', height: '12px', marginBottom: '6px' }} />
                  <div style={{ ...styles.skelLine, width: '60%', height: '12px', marginBottom: '16px' }} />
                  <div style={{ ...styles.skelLine, width: '100%', height: '38px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={styles.center}>
            <p style={{ color: '#e74c3c', marginBottom: '16px' }}>{error}</p>
            <button onClick={fetch} style={styles.retryBtn}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <motion.div style={styles.empty} {...fadeUp(0.2)}>
            <EmptyIcon />
            <p style={styles.emptyText}>{debouncedSearch ? 'No products match your search.' : 'No products available yet.'}</p>
            {debouncedSearch && <button onClick={() => setSearch('')} style={styles.clearSearchBtn}>Clear search</button>}
          </motion.div>
        ) : (
          <>
            <motion.div style={styles.grid} initial="hidden" animate="visible">
              <AnimatePresence mode="popLayout">
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout={false}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    style={styles.card}
                  >
                    <div style={styles.cardImgWrap}>
                      {p.images_url?.length > 0 ? (
                        <img src={p.images_url[0]} alt={p.title} loading="lazy" style={styles.cardImg} />
                      ) : (
                        <div style={styles.cardImgPlaceholder}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                      )}
                    </div>
                    <div style={styles.cardBody}>
                      <h2 style={styles.cardTitle}>{p.title}</h2>
                      {p.price != null && <div style={styles.cardMeta}><span style={styles.price}>{formatPrice(p.price)}</span></div>}
                      <p style={styles.cardDesc}>{truncate(p.description, 100)}</p>
                      <motion.a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I am interested in: ' + p.title)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={styles.whatsappBtn}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <WhatsAppIcon />
                        Order via WhatsApp
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <motion.div style={styles.pagination} {...fadeUp(0.3)}>
                <motion.button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ ...styles.pageBtn, opacity: page <= 1 ? 0.3 : 1 }}
                  whileHover={page > 1 ? { scale: 1.05 } : {}}
                  whileTap={page > 1 ? { scale: 0.95 } : {}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                </motion.button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <motion.button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{ ...styles.pageNum, background: n === page ? '#d4af37' : 'transparent', color: n === page ? '#000' : '#ccc', borderColor: n === page ? '#d4af37' : '#444' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {n}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{ ...styles.pageBtn, opacity: page >= totalPages ? 0.3 : 1 }}
                  whileHover={page < totalPages ? { scale: 1.05 } : {}}
                  whileTap={page < totalPages ? { scale: 0.95 } : {}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </motion.button>
              </motion.div>
            )}

            <motion.p style={styles.count} {...fadeUp(0.35)}>
              Showing {products.length} of {total} {total === 1 ? 'product' : 'products'}
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `url(${new URL('../assets/machineBG.jpeg', import.meta.url).href})`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: 'calc(100vh - 70px)',
    background: 'rgba(0,0,0,0.75)',
    padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)',
  },
  header: { textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 44px)' },
  title: {
    color: '#d4af37', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
    margin: 0, letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#999', fontSize: 'clamp(14px, 1.5vw, 17px)', marginTop: '8px',
  },
  searchWrap: {
    maxWidth: '560px', margin: '0 auto clamp(32px, 5vw, 48px)',
  },
  searchInner: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid #444',
    borderRadius: '50px', padding: '0 16px', transition: 'border-color 0.2s',
  },
  searchIcon: { color: '#888', flexShrink: 0, display: 'flex' },
  searchInput: {
    flex: 1, background: 'none', border: 'none', outline: 'none',
    color: '#eee', fontSize: 'clamp(13px, 1.3vw, 15px)', padding: '14px 4px',
    fontFamily: 'inherit',
  },
  clearBtn: {
    background: 'none', border: 'none', color: '#888', cursor: 'pointer',
    padding: '4px', display: 'flex', flexShrink: 0,
  },
  grid: {
    display: 'grid', gap: 'clamp(16px, 2vw, 24px)',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    maxWidth: '1200px', margin: '0 auto',
  },
  card: {
    background: 'linear-gradient(145deg, #111, #0a0a0a)',
    border: '1px solid #222', borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column',
  },
  cardImgWrap: {
    position: 'relative', width: '100%', aspectRatio: '4/3',
    background: '#111', overflow: 'hidden',
  },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardImgPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#151515',
  },
  badge: {
    position: 'absolute', top: '10px', left: '10px',
    background: 'rgba(212,175,55,0.9)', color: '#000',
    fontSize: '11px', fontWeight: 700, padding: '4px 10px',
    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  cardBody: {
    padding: 'clamp(14px, 2vw, 20px)', flex: 1,
    display: 'flex', flexDirection: 'column',
  },
  cardTitle: {
    color: '#fff', fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: 700,
    margin: '0 0 8px', lineHeight: 1.3,
  },
  cardMeta: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '10px', flexWrap: 'wrap',
  },
  price: {
    color: '#d4af37', fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 800,
  },
  featureCount: {
    color: '#888', fontSize: '12px',
  },
  cardDesc: {
    color: '#999', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px',
    flex: 1,
  },
  whatsappBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '11px 16px', borderRadius: '8px', fontWeight: 700,
    fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: 'auto',
  },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '6px', marginTop: 'clamp(32px, 5vw, 48px)',
  },
  pageBtn: {
    background: 'transparent', border: '1px solid #444', color: '#ccc',
    borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  pageNum: {
    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #444',
    cursor: 'pointer', fontWeight: 700, fontSize: '13px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  count: {
    textAlign: 'center', color: '#666', fontSize: '13px', marginTop: '16px',
  },
  center: { textAlign: 'center', padding: '60px 20px' },
  retryBtn: {
    background: '#d4af37', color: '#000', border: 'none',
    padding: '10px 28px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer',
  },
  empty: {
    textAlign: 'center', padding: '80px 20px', color: '#888',
  },
  emptyText: { fontSize: '15px', margin: '16px 0' },
  clearSearchBtn: {
    background: 'transparent', border: '1px solid #d4af37', color: '#d4af37',
    padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
  },
  skeleton: {
    background: 'linear-gradient(145deg, #0d0d0d, #151515)',
    border: '1px solid #222', borderRadius: '14px', overflow: 'hidden',
  },
  skelImg: { width: '100%', aspectRatio: '4/3', background: '#1a1a1a' },
  skelLine: { background: '#1a1a1a', borderRadius: '4px' },
};
