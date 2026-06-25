import { useState, useEffect, useCallback, useRef } from 'react';
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
  const gridRef = useRef(null);

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

  useEffect(() => {
    if (gridRef.current && !loading) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page, loading]);

  return (
    <div style={styles.page}>
      <style>{`.product-card:hover .product-card-img { transform: scale(1.08); } .product-card:hover .product-card-overlay { opacity: 1; }`}</style>
      <SEO title="Products" description="PRO CNC MAROC — Premium CNC products &amp; services in Morocco. Precision machining, laser cutting, engraving, 3D printing &amp; industrial maintenance. Quality guaranteed." canonicalUrl="/products" keywords="CNC products Morocco, machining services, laser cutting service, 3D printing service, metal fabrication Morocco" jsonLd={{ '@type': 'ItemList', name: 'Products', itemListElement: [] }} />
      <div style={styles.overlay}>
        <motion.div style={styles.header} {...fadeUp()}>
          <motion.span style={styles.badge}>Our Catalog</motion.span>
          <motion.h1 style={styles.title}>Products</motion.h1>
          <motion.p style={styles.subtitle} {...fadeUp(0.1)}>Professional CNC equipment, tooling & accessories — precision engineered for industry</motion.p>
          <div style={styles.titleDivider} />
        </motion.div>

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
          <div style={styles.grid} ref={gridRef}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={styles.skeleton}>
                <div style={styles.skelImg} />
                <div style={{ padding: 'clamp(14px, 2vw, 20px)' }}>
                  <div style={{ ...styles.skelLine, width: '75%', height: '18px', marginBottom: '10px' }} />
                  <div style={{ ...styles.skelLine, width: '35%', height: '14px', marginBottom: '14px' }} />
                  <div style={{ ...styles.skelLine, width: '90%', height: '12px', marginBottom: '6px' }} />
                  <div style={{ ...styles.skelLine, width: '55%', height: '12px', marginBottom: '18px' }} />
                  <div style={{ ...styles.skelLine, width: '100%', height: '40px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div style={styles.center} {...fadeUp(0.2)}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p style={{ color: '#e74c3c', margin: '16px 0' }}>{error}</p>
            <button onClick={fetch} style={styles.retryBtn}>Retry</button>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div style={styles.empty} {...fadeUp(0.2)}>
            <EmptyIcon />
            <p style={styles.emptyText}>{debouncedSearch ? 'No products match your search.' : 'No products available yet.'}</p>
            {debouncedSearch && <button onClick={() => setSearch('')} style={styles.clearSearchBtn}>Clear search</button>}
          </motion.div>
        ) : (
          <div ref={gridRef}>
            <div style={styles.resultsBar}>
              <span style={styles.resultsText}>
                {total === 0 ? 'No results' : `${total} ${total === 1 ? 'product' : 'products'} found`}
                {debouncedSearch && <span style={{ color: '#888' }}> for &ldquo;{debouncedSearch}&rdquo;</span>}
              </span>
            </div>

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
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="product-card"
                    style={styles.card}
                  >
                    <div style={styles.cardImgWrap}>
                      {p.images_url?.length > 0 ? (
                        <div style={styles.cardImgInner}>
                          <img src={p.images_url[0]} alt={p.title} loading="lazy" className="product-card-img" style={styles.cardImg} />
                          <div className="product-card-overlay" style={styles.cardImgOverlay}>
                            <span style={styles.viewLabel}>View Product</span>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.cardImgPlaceholder}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                      )}
                      {p.price != null && (
                        <div style={styles.priceBadge}>{formatPrice(p.price)}</div>
                      )}
                    </div>
                    <div style={styles.cardBody}>
                      <h2 style={styles.cardTitle}>{p.title}</h2>
                      {p.description && <p style={styles.cardDesc}>{truncate(p.description, 100)}</p>}
                      <motion.a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I am interested in: ' + p.title)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={styles.whatsappBtn}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <WhatsAppIcon />
                        Inquire Now
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
                {generatePageNumbers(page, totalPages).map((n, idx) =>
                  n === '...' ? (
                    <span key={`ellipsis-${idx}`} style={styles.ellipsis}>...</span>
                  ) : (
                    <motion.button
                      key={n}
                      onClick={() => setPage(n)}
                      style={{ ...styles.pageNum, background: n === page ? '#d4af37' : 'transparent', color: n === page ? '#000' : '#ccc', borderColor: n === page ? '#d4af37' : '#444' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {n}
                    </motion.button>
                  )
                )}
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
          </div>
        )}
      </div>
    </div>
  );
}

function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `url(${new URL('../assets/machineBG.jpeg', import.meta.url).href})`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.78) 100%)',
    padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)',
  },
  header: { textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 44px)' },
  badge: {
    display: 'inline-block', background: 'rgba(212,175,55,0.12)', color: '#d4af37',
    fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
    padding: '6px 16px', borderRadius: '20px', marginBottom: '14px',
    border: '1px solid rgba(212,175,55,0.2)',
  },
  title: {
    color: '#d4af37', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800,
    margin: '0 0 10px', letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#999', fontSize: 'clamp(14px, 1.5vw, 17px)', margin: '0 auto',
    maxWidth: '600px', lineHeight: 1.6,
  },
  titleDivider: {
    width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
    margin: '20px auto 0',
  },
  searchWrap: {
    maxWidth: '560px', margin: '0 auto clamp(32px, 5vw, 48px)',
  },
  searchInner: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid #444',
    borderRadius: '50px', padding: '0 18px', transition: 'border-color 0.2s',
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
  resultsBar: {
    maxWidth: '1200px', margin: '0 auto 16px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
  },
  resultsText: {
    color: '#999', fontSize: '14px',
  },
  grid: {
    display: 'grid', gap: 'clamp(16px, 2vw, 24px)',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    maxWidth: '1200px', margin: '0 auto',
  },
  card: {
    background: 'linear-gradient(165deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    display: 'flex', flexDirection: 'column',
    backdropFilter: 'blur(4px)',
  },
  cardImgWrap: {
    position: 'relative', width: '100%', aspectRatio: '4/3',
    background: '#0d0d0d', overflow: 'hidden',
  },
  cardImgInner: {
    width: '100%', height: '100%', position: 'relative',
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  cardImgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    padding: '16px', opacity: 0, transition: 'opacity 0.3s ease',
  },
  viewLabel: {
    color: '#fff', fontSize: '13px', fontWeight: 600,
    background: 'rgba(0,0,0,0.6)', padding: '6px 20px', borderRadius: '20px',
    backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)',
  },
  priceBadge: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'linear-gradient(135deg, #a37a39, #d4af37)',
    color: '#000', fontSize: 'clamp(13px, 1.2vw, 15px)', fontWeight: 800,
    padding: '5px 14px', borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
  },
  cardImgPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#151515',
  },
  cardBody: {
    padding: 'clamp(14px, 2vw, 20px)', flex: 1,
    display: 'flex', flexDirection: 'column',
  },
  cardTitle: {
    color: '#fff', fontSize: 'clamp(16px, 1.5vw, 18px)', fontWeight: 700,
    margin: '0 0 8px', lineHeight: 1.3,
  },
  cardDesc: {
    color: '#999', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px',
    flex: 1,
  },
  whatsappBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '12px 18px', borderRadius: '10px', fontWeight: 700,
    fontSize: '13px', border: 'none', cursor: 'pointer', marginTop: 'auto',
    boxShadow: '0 4px 14px rgba(37,211,102,0.25)',
  },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '6px', marginTop: 'clamp(36px, 5vw, 52px)',
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
  ellipsis: {
    color: '#666', fontSize: '14px', width: '24px', textAlign: 'center',
  },
  center: { textAlign: 'center', padding: '80px 20px' },
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
    background: 'linear-gradient(165deg, rgba(15,15,15,0.9), rgba(20,20,20,0.95))',
    border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', overflow: 'hidden',
  },
  skelImg: { width: '100%', aspectRatio: '4/3', background: '#181818' },
  skelLine: { background: '#181818', borderRadius: '4px' },
};
