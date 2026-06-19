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

  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

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

      <NavLink to="/" icon="⌂" style={{ '--i': 1 }}>Home</NavLink>

      <div style={{ '--i': 2 }}>
        <div className="nav-machines-wrap">
          <div className={`nav-link-row ${isOurMachinesActive ? 'active' : ''}`}>
            <Link to="/our-machines" onClick={closeAll} className="nav-machines-label">
              <span className="nav-link-icon">⚙</span>
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

      <NavLink to="/products" icon="▣" style={{ '--i': 3 }}>Products</NavLink>
      <NavLink to="/about-us" icon="ⓘ" style={{ '--i': 4 }}>About Us</NavLink>
      <NavLink to="/contact-us" icon="✉" style={{ '--i': 5 }}>Contact Us</NavLink>

      {user ? (
        <div className="nav-user-menu-section" style={{ '--i': 6 }}>
          <div className="nav-menu-section-label">Account</div>
          {user.role === 'admin' && (
            <Link to="/dashboard" onClick={closeAll} className="nav-link-row" style={{ color: '#a37a39' }}>
              <span className="nav-link-icon" style={{ color: '#a37a39' }}>◈</span>
              <span className="nav-link-label">Dashboard</span>
            </Link>
          )}
          <Link to="/my-gallery" onClick={closeAll} className="nav-link-row">
            <span className="nav-link-icon">▣</span>
            <span className="nav-link-label">My Gallery</span>
          </Link>
          <Link to="/profile" onClick={closeAll} className="nav-link-row">
            <span className="nav-link-icon">●</span>
            <span className="nav-link-label">My Profile</span>
          </Link>
          <button className="nav-link-row danger" onClick={() => { handleLogout(); closeAll(); }}>
            <span className="nav-link-icon">⏻</span>
            <span className="nav-link-label">Logout</span>
          </button>
        </div>
      ) : (
        <div className="nav-auth-group" style={{ '--i': 6 }}>
          <Link to="/login" className="nav-login-btn" onClick={closeAll}>🔒 Login</Link>
          <Link to="/signup" className="nav-signup-btn" onClick={closeAll}>🚀 Signup</Link>
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
      <style>{`.search-btn:hover { opacity: 1 !important; color: #b8894a !important; } .search-btn:active { transform: scale(0.92) !important; } .nav-mobile-icon:hover { opacity: 0.7 !important; } @media (min-width: 901px) { .nav-mobile-icons { display: none !important; } .nav-left { gap: 0 !important; } } @media (max-width: 900px) { .nav-mobile-icons { display: flex !important; } }`}</style>

      <div style={styles.navLeft}>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>PRO CNC MAROC</span>
        </Link>
      </div>

      <div className="nav-mobile-icons" style={styles.mobileIcons}>
        <Link to="/customer-gallery" onClick={closeAll} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Story">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>
            <line x1="8" y1="15" x2="12" y2="15"/>
          </svg>
        </Link>
        <Link to="/partner-map" onClick={closeAll} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Partner Map">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </Link>
        <button onClick={(e) => { e.stopPropagation(); setSearchOpen(true); }} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        {user ? (
          <Link to="/profile" onClick={closeAll} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        ) : (
          <Link to="/login" onClick={closeAll} className="nav-mobile-icon" style={styles.mobileIcon} aria-label="Login">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </Link>
        )}
      </div>
      <div className={`nav-links${menuOpen ? ' open' : ''}`} style={styles.links}>
        {isMobile() ? renderMobileMenu() : (
          <>
            <Link to="/" style={{...styles.link, ...active('/')}} onClick={closeAll}>Home</Link>
            <Link to="/customer-gallery" style={{...styles.link, ...active('/customer-gallery')}} onClick={closeAll}>Story</Link>
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
    fontSize: 'clamp(14px, 3vw, 24px)',
    fontWeight: '800',
    letterSpacing: '2px',
    color: '#a37a39',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(4px, 1vw, 12px)',
  },
  mobileIcons: {
    display: 'none',
    alignItems: 'center',
    gap: 'clamp(2px, 0.8vw, 6px)',
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
    background: '#a37a39',
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
};