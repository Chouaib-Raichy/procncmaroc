import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [mobileMachinesOpen, setMobileMachinesOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ddRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileProfileRef = useRef(null);

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
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileProfileOpen(false);
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

  const isActive = (path) => location.pathname === path || (typeof path === 'string' && path.startsWith && location.pathname.startsWith(path));
  const isOurMachinesActive = location.pathname.startsWith('/our-machines') || location.pathname.startsWith('/machines/');

  const NavLink = ({ to, icon, children, active: forceActive, arrow, onClick: extraClick, className = '', style: extraStyle }) => {
    const active = forceActive !== undefined ? forceActive : isActive(to);
    return (
      <Link to={to} onClick={() => { closeAll(); extraClick?.(); }}
        className={`nav-link-row ${active ? 'active' : ''} ${className}`}
        style={extraStyle}
      >
        {icon && <span className="nav-link-icon">{icon}</span>}
        <span className="nav-link-label">{children}</span>
        {arrow !== undefined && <span className={`nav-link-arrow${arrow ? ' open' : ''}`}>&#9656;</span>}
      </Link>
    );
  };

  const renderMobileMenu = () => (
    <>
      {user && (
        <div className="nav-user-card" style={{ '--i': 0 }}>
          {user.avatar_url && !imgError ? (
            <img src={user.avatar_url} alt="avatar"
              onError={() => setImgError(true)}
              className="nav-user-avatar"
            />
          ) : (
            <div className="nav-user-avatar-placeholder">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="nav-user-info">
            <div className="nav-user-name">{user.name}</div>
            <div className="nav-user-role">{user.role === 'admin' ? 'Administrator' : 'Member'}</div>
          </div>
        </div>
      )}

      <NavLink to="/" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} style={{ '--i': 1 }}>Home</NavLink>

      <div style={{ '--i': 2 }}>
        <div className="nav-machines-wrap">
          <div className={`nav-link-row ${isOurMachinesActive ? 'active' : ''}`}>
            <Link to="/our-machines" onClick={closeAll} className="nav-machines-label">
              <span className="nav-link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
              <span className="nav-link-label">Our Machines</span>
            </Link>
            <span className={`nav-link-arrow${mobileMachinesOpen ? ' open' : ''}`} onClick={() => setMobileMachinesOpen(!mobileMachinesOpen)}>&#9656;</span>
          </div>
          {mobileMachinesOpen && categories.length > 0 && (
            <div className="nav-cat-section">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div className="nav-cat-header" onClick={() => setMobileCatOpen(mobileCatOpen === cat.id ? null : cat.id)}>
                    <span className="nav-cat-label">{cat.name}</span>
                    {cat.machines?.length > 0 && (
                      <span className={`nav-cat-arrow${mobileCatOpen === cat.id ? ' open' : ''}`}>&#9656;</span>
                    )}
                  </div>
                  {mobileCatOpen === cat.id && cat.machines?.length > 0 && (
                    <div className="nav-machine-list">
                      {cat.machines.map((m, mi) => (
                        <Link key={m.id} to={`/machines/${m.id}`} className="nav-machine-link" onClick={closeAll}>{m.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NavLink to="/products" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>} style={{ '--i': 3 }}>Products</NavLink>
      <NavLink to="/about-us" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>} style={{ '--i': 4 }}>About Us</NavLink>
      <NavLink to="/contact-us" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} style={{ '--i': 5 }}>Contact Us</NavLink>
    </>
  );

  return (
    <motion.nav style={styles.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <style>{`.search-btn:hover { opacity: 1 !important; color: #b8894a !important; } .search-btn:active { transform: scale(0.92) !important; } .nav-mobile-icon:hover { opacity: 0.7 !important; } @media (min-width: 901px) { .nav-mobile-icons { display: none !important; } .nav-left { gap: clamp(8px, 1.5vw, 16px) !important; margin-right: 0 !important; } .logo-text { font-size: clamp(20px, 4vw, 26px) !important; } } @media (max-width: 900px) { .nav-mobile-icons { display: flex !important; } }`}</style>

      <div style={styles.navLeft} className="nav-left">
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText} className="logo-text">PRO CNC MAROC</span>
        </Link>
      </div>

      <div className="nav-mobile-icons" style={styles.mobileIcons}>
        <Link to="/stories" onClick={closeAll} className="nav-mobile-icon" style={{ ...styles.mobileIcon, color: location.pathname === '/stories' ? '#a37a39' : '#666', opacity: location.pathname === '/stories' ? 1 : 0.6 }} aria-label="Stories">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none"/>
          </svg>
        </Link>
        <Link to="/partner-map" onClick={closeAll} className="nav-mobile-icon" style={{ ...styles.mobileIcon, color: location.pathname === '/partner-map' ? '#a37a39' : '#666', opacity: location.pathname === '/partner-map' ? 1 : 0.6 }} aria-label="Partner Map">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </Link>
        <button onClick={(e) => { e.stopPropagation(); setSearchOpen(true); }} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        {user ? (
          <div ref={mobileProfileRef} style={{ position: 'relative' }}>
            <button onClick={(e) => { e.stopPropagation(); setMobileProfileOpen(!mobileProfileOpen); }} className="nav-mobile-icon" style={{ ...styles.mobileIcon, padding: '2px', borderRadius: '50%', overflow: 'hidden' }} aria-label="Profile">
              {user.avatar_url && !imgError ? (
                <img src={user.avatar_url} alt="avatar" onError={() => setImgError(true)} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: '1.5px solid #a37a39' }} />
              ) : (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '13px', fontWeight: 700, border: '1.5px solid #a37a39' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            {mobileProfileOpen && (
              <div style={styles.mobileProfileDropdown}>
                {user.role === 'admin' && (
                  <Link to="/dashboard" onClick={() => { setMobileProfileOpen(false); closeAll(); }} style={styles.mobileProfileItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a37a39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', verticalAlign: 'middle' }}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" onClick={() => { setMobileProfileOpen(false); closeAll(); }} style={styles.mobileProfileItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', verticalAlign: 'middle' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </Link>
                <Link to="/my-gallery" onClick={() => { setMobileProfileOpen(false); closeAll(); }} style={styles.mobileProfileItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', verticalAlign: 'middle' }}><rect x="2" y="2" width="20" height="20" rx="3"/><polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none"/></svg>
                  My Stories
                </Link>
                <div style={{ height: '1px', background: '#222', margin: '4px 0' }} />
                <button onClick={() => { setMobileProfileOpen(false); handleLogout(); }} style={{ ...styles.mobileProfileItem, color: '#e57373', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '13px', padding: '10px 16px', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e57373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" onClick={closeAll} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Login">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        )}
      </div>
      <div className={`nav-links${menuOpen ? ' open' : ''}`} style={styles.links}>
        {isMobile() ? renderMobileMenu() : (
          <>
            <Link to="/" style={{...styles.link, ...active('/')}} onClick={closeAll}>Home</Link>
            <Link to="/stories" style={{...styles.link, ...active('/stories')}} onClick={closeAll}>Stories</Link>
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
            <Link to="/about-us" style={{...styles.link, ...active('/about-us')}} onClick={closeAll}>About Us</Link>
            <Link to="/contact-us" style={{...styles.link, ...active('/contact-us')}} onClick={closeAll}>Contact Us</Link>

            <button onClick={(e) => { e.stopPropagation(); setSearchOpen(true); }} className="search-btn" style={styles.searchBtn} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

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
                      >My Stories</Link>
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
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
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
    fontSize: 'clamp(19px, 4vw, 26px)',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#a37a39',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    marginRight: 'clamp(12px, 3vw, 40px)',
  },
  mobileIcons: {
    display: 'none',
    alignItems: 'center',
    gap: 'clamp(2px, 0.8vw, 8px)',
    marginLeft: 'auto',
  },
  mobileIcon: {
    background: 'transparent',
    border: 'none',
    color: '#a37a39',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    transition: 'opacity 0.2s',
    textDecoration: 'none',
    lineHeight: 1,
  },
  links: {
    alignItems: 'center',
    gap: 'clamp(8px, 0.8vw, 14px)',
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
    background: '#8b682f',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 20px',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    whiteSpace: 'nowrap',
  },
  searchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#a37a39',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    lineHeight: 1,
    opacity: 0.85,
  },
  mobileProfileDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: '#0d0d0d',
    border: '1px solid #222',
    borderRadius: '10px',
    minWidth: '180px',
    zIndex: 3000,
    boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(163,122,57,0.1)',
    padding: '6px 0',
  },
  mobileProfileItem: {
    display: 'block',
    padding: '10px 16px',
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'background 0.15s',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
};