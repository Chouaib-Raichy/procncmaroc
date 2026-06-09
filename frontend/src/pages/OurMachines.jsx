import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllMachines } from '../api/machines';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getCategories } from '../api/categories';
import machineBg from '../assets/machineBG.jpeg';

export default function OurMachines() {
  const [allMachines, setAllMachines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const fetch = () => {
    setLoading(true);
    setError(null);
    Promise.all([getAllMachines(), getCategories()])
      .then(([mRes, cRes]) => {
        setAllMachines(mRes.data);
        setCategories(cRes.data);
      })
      .catch(() => setError('Failed to load machines. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let result = allMachines;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }
    if (catFilter) {
      result = result.filter((m) => String(m.category?.id ?? m.category_id) === catFilter);
    }
    return result;
  }, [allMachines, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  if (loading) {
    return <Loading text="Loading machines..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetch} />;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overlay}>
        <div style={styles.titleWrap}>
          <h1 style={styles.title}>Our Machines</h1>
          <p style={styles.subtitle}>RAYSET , CNC ROUTER . LASER CO2 . FIBER MARKING MACHINES </p>
        </div>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={styles.searchInput}
          />
          <select
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            style={styles.selectInput}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: '#ccc', textAlign: 'center', padding: '40px 0' }}>
            {allMachines.length === 0 ? 'No machines available yet.' : 'No machines match your search.'}
          </p>
        ) : (
          <>
            <div className="machine-grid" style={styles.cardGrid}>
              {paged.map((m) => (
                <div key={m.id} style={styles.card} className="machine-card">
                  <div style={styles.imgWrap}>
                    <img
                      src={m.image_url || 'https://placehold.co/400x250/ccc/333?text=Machine'}
                      alt={m.title}
                      style={styles.img}
                    />
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{m.title}</h3>
                    {m.price && <p style={styles.price}>{parseFloat(m.price).toLocaleString()} MAD</p>}
                    <p style={styles.desc}>{m.description}</p>
                    <Link to={`/machines/${m.id}`} style={styles.btn} className="more-btn">More infos</Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  style={{ ...styles.pageBtn, opacity: safePage === 1 ? 0.4 : 1 }}
                >&laquo; Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{ ...styles.pageBtn, ...(p === safePage ? styles.pageBtnActive : {}) }}
                  >{p}</button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  style={{ ...styles.pageBtn, opacity: safePage === totalPages ? 0.4 : 1 }}
                >Next &raquo;</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.65)',
    padding: 'calc(80px + clamp(20px, 3vw, 50px)) clamp(16px, 4vw, 60px) clamp(40px, 5vw, 80px)',
  },
  titleWrap: {
    textAlign: 'center',
    marginBottom: 'clamp(16px, 3vw, 32px)',
  },
  title: {
    fontSize: 'clamp(28px, 5vw, 52px)',
    fontWeight: '900',
    color: '#d4af37',
    textShadow: '2px 2px 10px rgba(0,0,0,0.9)',
    margin: '0 0 clamp(6px, 1vw, 12px)',
  },
  subtitle: {
    fontSize: 'clamp(16px, 2.5vw, 24px)',
    color: '#eee',
    textShadow: '1px 1px 6px rgba(0,0,0,0.8)',
    margin: 0,
  },
  filters: {
    display: 'flex',
    gap: 'clamp(10px, 2vw, 20px)',
    maxWidth: '600px',
    margin: '0 auto clamp(24px, 4vw, 40px)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  searchInput: {
    flex: '1 1 200px',
    padding: 'clamp(10px, 1.2vw, 12px) clamp(14px, 1.8vw, 18px)',
    border: '1px solid #a37a39',
    borderRadius: '6px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 'clamp(14px, 1.3vw, 15px)',
    outline: 'none',
    minWidth: '180px',
  },
  selectInput: {
    flex: '0 1 auto',
    padding: 'clamp(10px, 1.2vw, 12px) clamp(14px, 1.5vw, 18px)',
    border: '1px solid #a37a39',
    borderRadius: '6px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 'clamp(14px, 1.3vw, 15px)',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '150px',
  },
  cardGrid: {
    display: 'grid',
    gap: 'clamp(16px, 2vw, 24px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: 'linear-gradient(#111, #000)',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #a37a39',
    fontSize: '14px',
  },
  imgWrap: {
    width: '100%',
    overflow: 'hidden',
    maxHeight: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  },
  img: {
    width: '100%',
    height: 'auto',
    maxHeight: '240px',
    objectFit: 'contain',
    display: 'block',
  },
  cardBody: {
    padding: 'clamp(10px, 1.2vw, 14px)',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardTitle: {
    fontSize: 'clamp(16px, 1.6vw, 18px)',
    color: '#a37a39',
    margin: '0 0 6px',
  },
  price: {
    fontSize: 'clamp(14px, 1.3vw, 15px)',
    color: '#d4af37',
    fontWeight: '700',
    margin: '0 0 8px',
  },
  desc: {
    fontSize: 'clamp(13px, 1.2vw, 14px)',
    color: '#ccc',
    lineHeight: 1.6,
    flex: 1,
    margin: '0 0 10px',
  },
  btn: {
    display: 'block',
    textDecoration: 'none',
    textAlign: 'center',
    padding: 'clamp(10px, 1.1vw, 12px)',
    fontWeight: '700',
    fontSize: 'clamp(13px, 1.2vw, 14px)',
    borderRadius: '4px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: 'clamp(24px, 3vw, 40px)',
    flexWrap: 'wrap',
  },
  pageBtn: {
    background: 'transparent',
    border: '1px solid #a37a39',
    color: '#ddd',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: 'clamp(12px, 1.1vw, 14px)',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  pageBtnActive: {
    background: '#a37a39',
    color: '#fff',
    borderColor: '#a37a39',
  },
};
