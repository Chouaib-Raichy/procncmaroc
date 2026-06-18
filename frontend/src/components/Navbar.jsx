import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [mobileMachinesOpen, setMobileMachinesOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ddRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatar_url]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setActiveCat(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeAll = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setActiveCat(null);
    setMobileMachinesOpen(false);
    setMobileCatOpen(null);
  };

  const isMobile = () => window.innerWidth <= 900;
  const active = (path) => location.pathname === path ? { color: '#a37a39' } : {};

  const mobileLink = (path) => ({
    color: location.pathname === path ? '#a37a39' : '#ccc',
    fontWeight: location.pathname === path ? 700 : 500,
  });

  const renderMobileMenu = () => (
    <>
      {user && (
        <div className="nav-user-section">
          {user.avatar_url && !imgError ? (
            <img src={user.avatar_url} alt="avatar"
              onError={() => setImgError(true)}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #a37a39', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #a37a39', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="nav-user-name">{user.name}</div>
            <div className="nav-user-role">{user.role === 'admin' ? 'Administrator' : 'Member'}</div>
          </div>
        </div>
      )}

      <Link to="/" style={mobileLink('/')} onClick={closeAll}>Home</Link>
      <Link to="/partner-map" style={mobileLink('/partner-map')} onClick={closeAll}>Partner Map</Link>

      <div className="nav-machines-wrap">
        <div className="nav-machines-trigger" onClick={() => setMobileMachinesOpen(!mobileMachinesOpen)}
          style={{ color: location.pathname.startsWith('/our-machines') || location.pathname.startsWith('/machines/') ? '#a37a39' : '#ccc', fontWeight: (location.pathname.startsWith('/our-machines') || location.pathname.startsWith('/machines/')) ? 700 : 500 }}
        >
          <span>Our Machines</span>
          <span className={`nav-machines-arrow${mobileMachinesOpen ? ' open' : ''}`}>&#9656;</span>
        </div>
        {mobileMachinesOpen && categories.length > 0 && (
          <div className="nav-cat-section">
            {categories.map((cat) => (
              <div key={cat.id}>
                <div className="nav-cat-header" onClick={() => setMobileCatOpen(mobileCatOpen === cat.id ? null : cat.id)}>
                  <span style={{ color: '#a37a39', flex: 1, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{cat.name}</span>
                  {cat.machines?.length > 0 && (
                    <span className={`arrow${mobileCatOpen === cat.id ? ' open' : ''}`}>&#9656;</span>
                  )}
                </div>
                {mobileCatOpen === cat.id && cat.machines?.length > 0 && (
                  <div className="nav-machine-list">
                    {cat.machines.map((m) => (
                      <Link key={m.id} to={`/machines/${m.id}`} className="nav-machine-link" onClick={closeAll}>{m.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to="/products" style={mobileLink('/products')} onClick={closeAll}>Products</Link>
      <Link to="/customer-gallery" style={mobileLink('/customer-gallery')} onClick={closeAll}>Customer Gallery</Link>
      <Link to="/about-us" style={mobileLink('/about-us')} onClick={closeAll}>About Us</Link>
      <Link to="/contact-us" style={mobileLink('/contact-us')} onClick={closeAll}>Contact Us</Link>

      {user ? (
        <div className="nav-user-menu">
          {user.role === 'admin' && (
            <Link to="/dashboard" onClick={closeAll} style={{ color: '#a37a39' }}>Dashboard</Link>
          )}
          <Link to="/my-gallery" onClick={closeAll}>My Gallery</Link>
          <Link to="/profile" onClick={closeAll}>My Profile</Link>
          <button className="nav-logout-btn" onClick={() => { handleLogout(); closeAll(); }}>Logout</button>
        </div>
      ) : (
        <div className="nav-auth-group">
          <Link to="/login" className="nav-login-link" onClick={closeAll}>Login</Link>
          <Link to="/signup" className="nav-signup-link" onClick={closeAll}>Signup</Link>
        </div>
      )}
    </>
  );

  return (
    <motion.nav style={styles.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link to="/" style={styles.logo}>
        <span style={styles.logoText}>PRO CNC MAROC</span>
      </Link>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div className={`nav-links${menuOpen ? ' open' : ''}`} style={styles.links}>
        {isMobile() ? renderMobileMenu() : (
          <>
            <Link to="/" style={{...styles.link, ...active('/')}} onClick={closeAll}>Home</Link>
            <Link to="/partner-map" style={{...styles.link, ...active('/partner-map')}} onClick={closeAll}>Partner Map</Link>

            <div ref={ddRef} style={{ position: 'relative' }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => { setDropdownOpen(false); setActiveCat(null); }}
            >
              <Link
                to="/our-machines"
                onClick={closeAll}
                style={{ ...styles.link, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', ...(location.pathname.startsWith('/our-machines') || location.pathname.startsWith('/machines/') ? { color: '#a37a39' } : {}) }}
              >
                Our Machines <span style={{ fontSize: '10px' }}>&#9662;</span>
              </Link>

              {dropdownOpen && categories.length > 0 && (
                <div style={styles.dropdown}>
                  {categories.map((cat) => (
                    <div key={cat.id} style={styles.catItem}
                      onMouseEnter={() => setActiveCat(cat.id)}
                      onMouseLeave={() => setActiveCat(null)}
                    >
                      <div style={styles.catRow}>
                        <Link to="/our-machines" style={styles.catLabel} onClick={closeAll}>{cat.name}</Link>
                        {cat.machines?.length > 0 && <span style={styles.arrow}>&#9656;</span>}
                      </div>
                      {activeCat === cat.id && cat.machines?.length > 0 && (
                        <div style={styles.subDropdown}>
                          {cat.machines.map((m) => (
                            <Link key={m.id} to={`/machines/${m.id}`} style={styles.machineLink} onClick={closeAll}>{m.title}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" style={{...styles.link, ...active('/products')}} onClick={closeAll}>Products</Link>
            <Link to="/customer-gallery" style={{...styles.link, ...active('/customer-gallery')}} onClick={closeAll}>Customer Gallery</Link>
            <Link to="/about-us" style={{...styles.link, ...active('/about-us')}} onClick={closeAll}>About Us</Link>
            <Link to="/contact-us" style={{...styles.link, ...active('/contact-us')}} onClick={closeAll}>Contact Us</Link>

            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <div onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '50%', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {user.avatar_url && !imgError ? (
                    <img src={user.avatar_url} alt="avatar"
                      onError={() => setImgError(true)}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #a37a39', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #a37a39', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '16px', fontWeight: 700 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {userMenuOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#000', border: '1px solid #333', borderRadius: '8px', minWidth: '180px', zIndex: 2000, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', padding: '6px 0' }}>
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #222', color: '#a37a39', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/dashboard" onClick={() => { setUserMenuOpen(false); closeAll(); }}
                        style={{ display: 'block', padding: '10px 16px', color: '#a37a39', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.target.style.background = '#111'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >Dashboard</Link>
                    )}
                    <Link to="/my-gallery" onClick={() => { setUserMenuOpen(false); closeAll(); }}
                      style={{ display: 'block', padding: '10px 16px', color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = '#111'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >My Gallery</Link>
                    <Link to="/profile" onClick={() => { setUserMenuOpen(false); closeAll(); }}
                      style={{ display: 'block', padding: '10px 16px', color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = '#111'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >My Profile</Link>
                    <button onClick={() => { setUserMenuOpen(false); handleLogout(); closeAll(); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', color: '#e57373', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = '#111'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.authGroup}>
                <Link to="/login" style={{...styles.link, ...active('/login')}} onClick={closeAll}>Login</Link>
                <Link to="/signup" className="signup-link" style={styles.signupBtn} onClick={closeAll}>Signup</Link>
              </div>
            )}
          </>
        )}
      </div>
    </motion.nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 clamp(16px, 4vw, 40px)',
    height: '70px',
    background: 'linear-gradient(to bottom, #000 0%, #1a1a1a 100%)',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#a37a39',
    padding: '8px 0',
    flexShrink: 0,
  },
  logoText: {
    fontSize: 'clamp(18px, 3vw, 24px)',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#a37a39',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  links: {
    alignItems: 'center',
    gap: 'clamp(8px, 1.5vw, 20px)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    flexWrap: 'wrap',
  },
  link: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    fontWeight: '500',
    padding: '8px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#000',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '6px 0',
    minWidth: '200px',
    zIndex: 2000,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  },
  catItem: {
    position: 'relative',
  },
  catRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 16px',
    transition: 'background 0.2s',
  },
  catLabel: {
    color: '#a37a39',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textDecoration: 'none',
    flex: 1,
  },
  arrow: {
    color: '#666',
    fontSize: '11px',
    marginLeft: '8px',
  },
  subDropdown: {
    position: 'absolute',
    top: 0,
    left: '100%',
    background: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '6px 0',
    minWidth: '180px',
    zIndex: 2001,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  },
  machineLink: {
    display: 'block',
    color: '#bbb',
    textDecoration: 'none',
    fontSize: '13px',
    padding: '6px 16px',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  },
  authGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  userName: {
    color: '#a37a39',
    fontWeight: '600',
    fontSize: 'clamp(12px, 1.2vw, 14px)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #a37a39',
    color: '#a37a39',
    padding: '6px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
  },
  signupBtn: {
    background: '#a37a39',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    whiteSpace: 'nowrap',
  },
};