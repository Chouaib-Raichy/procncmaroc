import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '../api/search';

const ICONS = {
  users: '👤',
  machines: '⚙',
  products: '▣',
  posts: '◇',
};

const LABELS = {
  users: 'People',
  machines: 'Machines',
  products: 'Products',
  posts: 'Posts',
};

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [flatList, setFlatList] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setResults(null);
        setFlatList([]);
        setSelectedIndex(-1);
        return;
      }
      setLoading(true);
      searchAll(query)
        .then((res) => {
          const data = res.data;
          setResults(data);
          const flat = [];
          if (data.users?.length) flat.push({ type: 'header', key: 'users' }, ...data.users.map((u) => ({ type: 'user', data: u })));
          if (data.machines?.length) flat.push({ type: 'header', key: 'machines' }, ...data.machines.map((m) => ({ type: 'machine', data: m })));
          if (data.products?.length) flat.push({ type: 'header', key: 'products' }, ...data.products.map((p) => ({ type: 'product', data: p })));
          if (data.posts?.length) flat.push({ type: 'header', key: 'posts' }, ...data.posts.map((p) => ({ type: 'post', data: p })));
          setFlatList(flat);
          setSelectedIndex(-1);
        })
        .catch(() => setResults({ users: [], machines: [], products: [], posts: [] }))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((item) => {
    onClose();
    if (item.type === 'user') navigate(`/profile/${item.data.id}`);
    else if (item.type === 'machine') navigate(`/machines/${item.data.id}`);
    else if (item.type === 'product') navigate('/products');
    else if (item.type === 'post') navigate('/stories');
  }, [navigate, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatList.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatList.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const item = flatList[selectedIndex];
      if (item.type !== 'header') handleSelect(item);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const total = results
    ? (results.users?.length || 0) + (results.machines?.length || 0) + (results.products?.length || 0) + (results.posts?.length || 0)
    : 0;

  return (
    <div style={styles.overlay} onClick={onClose} onKeyDown={handleKeyDown}>
      <style>{`@keyframes searchSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            style={styles.input}
            placeholder="Search people, machines, products, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button style={styles.clearBtn} onClick={() => { setQuery(''); setResults(null); setFlatList([]); inputRef.current?.focus(); }}>✕</button>
          )}
        </div>

        <div style={styles.body}>
          {loading && (
            <div style={styles.centerMsg}>
              <div style={styles.spinner} />
              <span>Searching...</span>
            </div>
          )}

          {!loading && query.length >= 2 && total === 0 && (
            <div style={styles.centerMsg}>
              <span style={styles.noResultsIcon}>🔍</span>
              <span>No results found for &quot;{query}&quot;</span>
            </div>
          )}

          {!loading && results && total > 0 && (
            <div style={styles.resultsList}>
              {flatList.map((item, i) => {
                if (item.type === 'header') {
                  return (
                    <div key={item.key} style={styles.groupHeader}>
                      <span style={styles.groupIcon}>{ICONS[item.key]}</span>
                      <span style={styles.groupLabel}>{LABELS[item.key]}</span>
                    </div>
                  );
                }

                const isSelected = i === selectedIndex;
                const data = item.data;

                return (
                  <div
                    key={`${item.type}-${data.id}`}
                    style={{ ...styles.resultItem, ...(isSelected ? styles.resultItemSelected : {}) }}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    {item.type === 'user' && (
                      <>
                        <div style={styles.avatar}>
                          {data.avatar_url ? (
                            <img src={data.avatar_url} alt="" style={styles.avatarImg} />
                          ) : (
                            <div style={styles.avatarPlaceholder}>{data.name?.charAt(0)}</div>
                          )}
                        </div>
                        <div style={styles.resultInfo}>
                          <div style={styles.resultTitle}>{data.name}</div>
                          <div style={styles.resultSub}>{data.entreprise_name || data.city || data.business_location || 'Partner'}</div>
                        </div>
                      </>
                    )}
                    {item.type === 'machine' && (
                      <>
                        <div style={styles.iconBox}>⚙</div>
                        <div style={styles.resultInfo}>
                          <div style={styles.resultTitle}>{data.title}</div>
                          <div style={styles.resultSub}>{data.category?.name || ''}{data.category?.name && data.price ? ' · ' : ''}{data.price ? `${Number(data.price).toLocaleString()} MAD` : ''}</div>
                        </div>
                      </>
                    )}
                    {item.type === 'product' && (
                      <>
                        <div style={styles.iconBox}>▣</div>
                        <div style={styles.resultInfo}>
                          <div style={styles.resultTitle}>{data.title}</div>
                          <div style={styles.resultSub}>{data.price ? `${Number(data.price).toLocaleString()} MAD` : ''}</div>
                        </div>
                      </>
                    )}
                    {item.type === 'post' && (
                      <>
                        <div style={styles.iconBox}>◇</div>
                        <div style={styles.resultInfo}>
                          <div style={styles.resultTitle}>{data.title}</div>
                          <div style={styles.resultSub}>{data.user?.name || ''}{data.description ? ` · ${data.description.substring(0, 60)}${data.description.length > 60 ? '...' : ''}` : ''}</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div style={styles.centerMsg}>
              <span style={styles.hintIcon}>⌨</span>
              <span>Type at least 2 characters to search</span>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <span style={styles.footerKey}>↑↓</span> navigate
          <span style={{ ...styles.footerKey, marginLeft: 12 }}>⏎</span> select
          <span style={{ ...styles.footerKey, marginLeft: 12 }}>⎋</span> close
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 'clamp(40px, 8vh, 100px)',
  },
  modal: {
    width: 'min(640px, 92vw)',
    height: 'fit-content',
    maxHeight: 'clamp(400px, 70vh, 700px)',
    background: '#0d0d0d',
    border: '1px solid #222',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(163,122,57,0.15)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #1a1a1a',
    background: '#0a0a0a',
  },
  searchIcon: {
    fontSize: '20px',
    flexShrink: 0,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#eee',
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontFamily: 'inherit',
  },
  clearBtn: {
    background: '#222',
    border: 'none',
    color: '#999',
    fontSize: '14px',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    minHeight: '120px',
    maxHeight: 'calc(clamp(400px, 70vh, 700px) - 120px)',
  },
  centerMsg: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 20px',
    color: '#666',
    fontSize: '14px',
  },
  noResultsIcon: { fontSize: '32px', opacity: 0.4 },
  hintIcon: { fontSize: '28px', opacity: 0.3 },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid #222',
    borderTop: '2px solid #a37a39',
    borderRadius: '50%',
    animation: 'searchSpin 0.6s linear infinite',
  },
  resultsList: {
    padding: '8px 0',
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px 4px',
    marginTop: '4px',
  },
  groupIcon: { fontSize: '13px', opacity: 0.4 },
  groupLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  resultItemSelected: {
    background: 'rgba(163,122,57,0.12)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    border: '1px solid #333',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    color: '#a37a39',
    fontSize: '16px',
    fontWeight: 700,
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#141414',
    border: '1px solid #222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    color: '#eee',
    fontSize: 'clamp(13px, 1.6vw, 15px)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultSub: {
    color: '#666',
    fontSize: '12px',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    padding: '10px 20px',
    borderTop: '1px solid #1a1a1a',
    fontSize: '11px',
    color: '#444',
  },
  footerKey: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '10px',
    color: '#666',
    marginRight: '4px',
  },
};
