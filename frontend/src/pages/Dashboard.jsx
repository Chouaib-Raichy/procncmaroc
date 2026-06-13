import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import {
  getAdminMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from '../api/machines';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import { getMessages } from '../api/contacts';
import { getUsers, toggleBanUser, getPendingUsers, approveUser, rejectUser } from '../api/users';
import { getSettings, toggleSetting } from '../api/settings';
import { getVisitors, getStatsSummary } from '../api/visitors';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import SEO from '../components/SEO';

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'users', label: 'Users', icon: '👥' },
  { key: 'visitors', label: 'Visitors', icon: '🌐' },
  { key: 'machines', label: 'Machines', icon: '⚙️' },
  { key: 'categories', label: 'Categories', icon: '📁' },
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'messages', label: 'Messages', icon: '✉️' },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <>
      <SEO title="Admin Dashboard" description="PRO CNC MAROC admin dashboard — manage users, machines, categories, gallery, and site settings." canonicalUrl="/dashboard" />
      <div className="dashboard-page" style={{ display: 'flex', height: '100vh', padding: 0, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '220px' : '60px',
        background: '#0a0a0a',
        borderRight: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        overflow: 'hidden',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}>
        <div style={{
          padding: 'clamp(16px, 2vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #222',
          minHeight: '70px',
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none', border: 'none', color: '#a37a39', fontSize: '22px',
            cursor: 'pointer', flexShrink: 0, lineHeight: 1,
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
          {sidebarOpen && <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap' }}>Admin Panel</span>}
        </div>
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '12px 16px', background: 'none', border: 'none',
              color: activeTab === item.key ? '#a37a39' : '#888',
              fontSize: '14px', fontWeight: activeTab === item.key ? 700 : 500,
              cursor: 'pointer', textAlign: 'left', transition: '0.2s',
              borderLeft: activeTab === item.key ? '3px solid #a37a39' : '3px solid transparent',
            }}
              onMouseEnter={(e) => { if (activeTab !== item.key) e.target.style.color = '#a37a39'; }}
              onMouseLeave={(e) => { if (activeTab !== item.key) e.target.style.color = '#888'; }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 'clamp(20px, 3vw, 36px)', overflowY: 'auto', height: '100vh', minWidth: 0 }}>
        <div style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 34px)', color: '#d4af37', margin: 0 }}>
            {sidebarItems.find(i => i.key === activeTab)?.label}
          </h1>
          <p style={{ color: '#aaa', fontSize: 'clamp(13px, 1.3vw, 15px)', marginTop: '4px' }}>
            Welcome back, {user.name}
          </p>
        </div>
        {          activeTab === 'overview' ? <Overview /> :
          activeTab === 'users' ? <UsersManager /> :
         activeTab === 'visitors' ? <VisitorsManager /> :
         activeTab === 'machines' ? <MachineManager /> :
         activeTab === 'categories' ? <CategoryManager /> :
          activeTab === 'pending' ? <PendingRegistrations /> :
          activeTab === 'messages' ? <MessagesManager /> : null}
      </div>
    </div>
    </>
  );
}

const thStyle = { padding: '10px 12px', color: '#d4af37', fontWeight: 700, textAlign: 'left', background: '#111', whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 12px', color: '#ccc' };

/* ---------- Overview ---------- */
function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    getStatsSummary().then((res) => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n) => Number(n).toLocaleString();

  const icons = {
    'Total Users':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a37a39" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>,
    'Pending Approvals':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff9800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>,
    'Total Machines':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2196f3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>,
    'Messages':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>,
    'Total Visits':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" /><path d="M12 20c-4.42 0-8-4-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>,
    'Visits Today':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>,
    'Unique Visitors':
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>,
  };

  const cardMeta = [
    { label: 'Total Users', value: stats?.total_users, color: '#a37a39', bg: 'rgba(163,122,57,0.08)' },
    { label: 'Pending Approvals', value: stats?.pending_users, color: '#ff9800', bg: 'rgba(255,152,0,0.08)' },
    { label: 'Total Machines', value: stats?.total_machines, color: '#2196f3', bg: 'rgba(33,150,243,0.08)' },
    { label: 'Messages', value: stats?.total_messages, color: '#9c27b0', bg: 'rgba(156,39,176,0.08)' },
    { label: 'Total Visits', value: stats?.total_visits, color: '#4caf50', bg: 'rgba(76,175,80,0.08)' },
    { label: 'Visits Today', value: stats?.visits_today, color: '#f44336', bg: 'rgba(244,67,54,0.08)' },
    { label: 'Unique Visitors', value: stats?.unique_visitors, color: '#00bcd4', bg: 'rgba(0,188,212,0.08)' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(20px, 3vw, 32px)' }}>
          <h2 style={{ color: '#d4af37', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, margin: 0 }}>Dashboard Overview</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{ background: 'linear-gradient(145deg, #0d0d0d, #161616)', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1a1a1a', marginBottom: '14px' }} />
              <div style={{ width: '60%', height: '22px', borderRadius: '4px', background: '#1a1a1a', marginBottom: '8px' }} />
              <div style={{ width: '40%', height: '14px', borderRadius: '4px', background: '#1a1a1a' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>Failed to load stats</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(20px, 3vw, 32px)' }}>
        <div>
          <h2 style={{ color: '#d4af37', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 700, margin: 0 }}>Dashboard Overview</h2>
          <p style={{ color: '#777', fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>Real-time platform analytics summary</p>
        </div>
        <span style={{ fontSize: '12px', color: '#555', background: '#0d0d0d', padding: '6px 14px', borderRadius: '20px', border: '1px solid #222', whiteSpace: 'nowrap' }}>
          Updated live
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}
      >
        {cardMeta.map((c) => (
          <motion.div
            key={c.label}
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: `0 12px 32px ${c.color}18`, borderColor: c.color + '44' }}
            style={{
              background: 'linear-gradient(145deg, #0d0d0d, #161616)',
              border: '1px solid #222',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              cursor: 'default',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
              borderRadius: '0 12px 0 80px',
              background: `linear-gradient(135deg, transparent 50%, ${c.bg} 50%)`,
            }} />
            <div style={{ marginBottom: '14px' }}>{icons[c.label]}</div>
            <div style={{ fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 700, color: c.color, lineHeight: 1.1, marginBottom: '4px' }}>
              {fmt(c.value ?? 0)}
            </div>
            <div style={{ color: '#888', fontSize: '13px', fontWeight: 500 }}>{c.label}</div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${c.color}44, ${c.color}, ${c.color}44)`,
              borderRadius: '0 0 12px 12px',
            }} />
          </motion.div>
        ))}
      </motion.div>

      {stats.visits_per_day?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: 'linear-gradient(145deg, #0d0d0d, #161616)',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: 'clamp(20px, 2.5vw, 28px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: '#d4af37', fontSize: '16px', fontWeight: 700, margin: 0 }}>Visits — Last 7 Days</h3>
              <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>
                {fmt(stats.visits_per_day.reduce((a, d) => a + d.count, 0))} total visits
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a37a39' }} />
              Daily count
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 'clamp(6px, 1vw, 12px)',
            height: '180px', padding: '0 4px', position: 'relative',
          }}>
            {stats.visits_per_day.map((d) => {
              const max = Math.max(...stats.visits_per_day.map((x) => x.count), 1);
              const h = (d.count / max) * (160 - 20) + 20;
              const isHovered = hoveredDay === d.date;
              return (
                <div
                  key={d.date}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}
                  onMouseEnter={() => setHoveredDay(d.date)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {isHovered && (
                    <div style={{
                      position: 'absolute', top: '-32px', background: '#a37a39', color: '#fff',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                      whiteSpace: 'nowrap', zIndex: 2,
                    }}>
                      {d.count} visits
                    </div>
                  )}
                  <div style={{
                    width: '100%',
                    height: `${h}px`,
                    background: isHovered
                      ? 'linear-gradient(to top, #c8952e, #e8b830)'
                      : 'linear-gradient(to top, #a37a39, #c8952e)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s, background 0.2s',
                    boxShadow: isHovered ? `0 0 20px rgba(163,122,57,0.3)` : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)',
                    }} />
                  </div>
                  <span style={{
                    color: isHovered ? '#d4af37' : '#666',
                    fontSize: '11px',
                    fontWeight: isHovered ? 700 : 500,
                    marginTop: '6px',
                    transition: 'color 0.2s',
                  }}>
                    {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Users Manager ---------- */
const userRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' } }),
};

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);
  const [siteSettings, setSiteSettings] = useState({ show_whatsapp: '1', show_maps: '1', show_email: '1' });

  const load = () => { getUsers().then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  useEffect(() => { getSettings().then((r) => setSiteSettings(r.data)).catch(() => {}); }, []);

  const handleToggleSetting = async (key) => {
    try { const r = await toggleSetting(key); setSiteSettings((p) => ({ ...p, [key]: r.data.value })); } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleToggleBan = async (id) => {
    try { await toggleBanUser(id); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleViewProfile = (u) => setViewingUser(u);

  if (loading) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Registered Users</h2>
        </div>
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={table}>
            <thead>
              <tr><th style={th}>ID</th><th style={th}>Name</th><th style={th}>Email</th><th style={th}>Role</th><th style={th}>Status</th><th style={th}>Actions</th></tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((i) => (
                <tr key={i} style={tr}>
                  {[1,2,3,4,5,6].map((j) => (
                    <td key={j} style={td}><div style={{ height:'14px', background:'#1a1a1a', borderRadius:'4px', width: j === 2 ? '120px' : j === 3 ? '160px' : '60px' }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={sectionHeader}>
        <div>
          <h2 style={sectionTitle}>Registered Users</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>{users.length} total users</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Contact:</span>
          {[
            { key: 'show_whatsapp', label: 'WA', onColor: '#25D366', offColor: '#555' },
            { key: 'show_maps', label: 'Maps', onColor: '#4285F4', offColor: '#555' },
            { key: 'show_email', label: 'Email', onColor: '#d4af37', offColor: '#555' },
          ].map(({ key, label, onColor, offColor }) => (
            <motion.button
              key={key}
              onClick={() => handleToggleSetting(key)}
              style={{
                ...smallBtn,
                background: siteSettings[key] === '1' ? onColor : offColor,
                opacity: siteSettings[key] === '1' ? 1 : 0.5,
                minWidth: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                fontSize: '11px',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u.id}
                custom={i}
                variants={userRowVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ backgroundColor: 'rgba(163,122,57,0.04)' }}
                style={tr}
              >
                <td style={td}>{u.id}</td>
                <td style={{ ...td, fontWeight: '600', color: '#fff' }}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>
                  {u.role === 'admin' ? (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', color:'#d4af37', fontWeight:700 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Admin
                    </span>
                  ) : (
                    <span style={{ color:'#999' }}>User</span>
                  )}
                </td>
                <td style={td}>
                  {u.banned_at ? (
                    <span style={{ ...badge, background:'#e74c3c', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      Banned
                    </span>
                  ) : (
                    <span style={{ ...badge, background:'#27ae60', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      Active
                    </span>
                  )}
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <motion.button
                      style={{ ...smallBtn, background:'#3498db', display:'inline-flex', alignItems:'center', gap:'4px' }}
                      onClick={() => handleViewProfile(u)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      Profile
                    </motion.button>
                    {u.role !== 'admin' && (
                      <motion.button
                        style={{ ...smallBtn, background: u.banned_at ? '#27ae60' : '#e74c3c', display:'inline-flex', alignItems:'center', gap:'4px' }}
                        onClick={() => handleToggleBan(u.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {u.banned_at
                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>
                            : <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
                          }
                        </svg>
                        {u.banned_at ? 'Unban' : 'Ban'}
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={overlay}
          onClick={() => setViewingUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ ...modal, maxWidth: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'clamp(16px, 2vw, 24px)' }}>
              <div style={{
                width:'52px', height:'52px', borderRadius:'50%',
                background:'linear-gradient(135deg, #a37a39, #c8952e)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#000', fontWeight:'bold', fontSize:'22px', flexShrink:0,
              }}>
                {viewingUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ ...modalTitle, margin:0 }}>{viewingUser.name}</h2>
                <span style={{ color:'#999', fontSize:'13px' }}>{viewingUser.email}</span>
              </div>
            </div>
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(10px, 1.5vw, 16px)',
              marginBottom:'20px', fontSize:'14px', color:'#ccc',
            }}>
              {[
                { label:'Role', value: viewingUser.role === 'admin' ? 'Administrator' : 'Standard User' },
                { label:'Status', value: viewingUser.banned_at ? 'Banned' : 'Active' },
                { label:'Registered', value: new Date(viewingUser.created_at).toLocaleDateString() },
                { label:'Last Active', value: viewingUser.last_activity_at ? new Date(viewingUser.last_activity_at).toLocaleString() : 'Never' },
                { label:'Email', value: viewingUser.email },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ color:'#d4af37', fontSize:'12px', fontWeight:600, marginBottom:'2px' }}>{f.label}</div>
                  <div>{f.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <motion.button
                style={saveBtn}
                onClick={() => setViewingUser(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
/* ---------- Pending Registrations ---------- */
function PendingRegistrations() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetch = (p = page) => {
    setLoading(true);
    setError(null);
    getPendingUsers(p).then((res) => {
      setUsers(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page, total: res.data.total });
    }).catch(() => setError('Failed to load pending users')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); }, []);

  const goToPage = (p) => {
    setPage(p);
    fetch(p);
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this user? Their account will be permanently deleted.')) return;
    try {
      await rejectUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
  };

  const pendingContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const pendingCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  if (loading) return (
    <div>
      <div style={pendingHeader}>
        <h2 style={sectionTitle}>Pending Registrations</h2>
      </div>
      <div style={cardGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={skeletonCard}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
              <div style={skeletonAvatar} />
              <div style={{ flex:1 }}>
                <div style={{ ...skeletonLine, width:'60%' }} />
                <div style={{ ...skeletonLine, width:'40%', marginBottom:0 }} />
              </div>
            </div>
            <div style={skeletonLine} />
            <div style={{ ...skeletonLine, width:'50%' }} />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div>
      <div style={pendingHeader}>
        <h2 style={sectionTitle}>Pending Registrations</h2>
      </div>
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#ff6b6b' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ marginBottom: '20px', fontSize: '15px' }}>{error}</p>
        <motion.button onClick={() => fetch()} style={retryBtn} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Try Again</motion.button>
      </div>
    </div>
  );

  if (users.length === 0) return (
    <div>
      <div style={pendingHeader}>
        <h2 style={sectionTitle}>Pending Registrations</h2>
      </div>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom: '20px' }}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" />
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
        <p style={{ color: '#888', fontSize: '16px' }}>No pending registrations</p>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>All users have been reviewed</p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={pendingHeader}>
        <div>
          <h2 style={sectionTitle}>Pending Registrations</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>{pagination?.total || users.length} pending</p>
        </div>
        <span style={countBadge}>{users.length} pending</span>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            style={lightboxOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox} alt=""
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={cardGrid}
        variants={pendingContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {users.map((u) => (
            <motion.div
              key={u.id}
              style={userCard}
              variants={pendingCardVariants}
              exit={{ opacity: 0, x: -100 }}
              layout
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', borderColor: '#a37a3944' }}
            >
              <div style={cardTop}>
                <div style={userAvatar}>{u.name?.charAt(0).toUpperCase()}</div>
                <div style={userInfo}>
                  <div style={userName}>{u.name}</div>
                  {u.entreprise_name && <div style={userCompany}>{u.entreprise_name}</div>}
                  <div style={userEmail}>{u.email}</div>
                </div>
              </div>

              <div style={cardDivider} />

              <div style={cardBody}>
                <div style={infoRow}>
                  <span style={infoLabel}>Phone</span>
                  <span style={infoValue}>{u.phone || '-'}</span>
                </div>
                <div style={infoRow}>
                  <span style={infoLabel}>Location</span>
                  <span style={infoValue}>{u.business_location || '-'}</span>
                </div>
                <div style={infoRow}>
                  <span style={infoLabel}>City / Country</span>
                  <span style={infoValue}>{[u.city, u.country].filter(Boolean).join(', ') || '-'}</span>
                </div>
                <div style={infoRow}>
                  <span style={infoLabel}>Registered</span>
                  <span style={infoValue}>{new Date(u.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {u.business_bio && (
                <div style={bioBox}>
                  <div style={bioLabel}>Bio</div>
                  <p style={bioText}>{u.business_bio}</p>
                </div>
              )}

              {u.business_images_url?.length > 0 && (
                <div style={imagesBox}>
                  <div style={bioLabel}>Business Images</div>
                  <div style={imageGrid}>
                    {u.business_images_url.map((url, i) => (
                      <motion.img
                        key={i}
                        src={url}
                        alt={`img ${i + 1}`}
                        style={thumbImg}
                        whileHover={{ scale: 1.08 }}
                        onClick={() => setLightbox(url)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={cardActions}>
                <motion.button
                  onClick={() => handleApprove(u.id)}
                  style={approveBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Approve
                </motion.button>
                <motion.button
                  onClick={() => handleReject(u.id)}
                  style={rejectBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {pagination && pagination.last > 1 && (
        <div style={paginationRow}>
          <span style={paginationInfo}>{pagination.total} total — Page {pagination.current} of {pagination.last}</span>
          <div style={paginationBtns}>
            <motion.button
              style={pageBtn(pagination.current <= 1)}
              disabled={pagination.current <= 1}
              onClick={() => goToPage(pagination.current - 1)}
              whileHover={pagination.current > 1 ? { scale: 1.05 } : {}}
              whileTap={pagination.current > 1 ? { scale: 0.95 } : {}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              Prev
            </motion.button>
            {Array.from({ length: pagination.last }, (_, i) => i + 1).map((p) => (
              <motion.button
                key={p}
                style={pageNumBtn(p === pagination.current)}
                onClick={() => goToPage(p)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {p}
              </motion.button>
            ))}
            <motion.button
              style={pageBtn(pagination.current >= pagination.last)}
              disabled={pagination.current >= pagination.last}
              onClick={() => goToPage(pagination.current + 1)}
              whileHover={pagination.current < pagination.last ? { scale: 1.05 } : {}}
              whileTap={pagination.current < pagination.last ? { scale: 0.95 } : {}}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Machine Manager ---------- */
function MachineManager() {
  const [machines, setMachines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', visible: true, category_id: '', price: '', features: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminMachines().then((res) => setMachines(res.data)).catch(() => {});
    getCategories().then((res) => setCategories(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', visible: true, category_id: '', price: '', features: '' });
    setImage(null); setPreview(null); setPdfFile(null); setPdfName('');
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      title: m.title, description: m.description, visible: m.visible,
      category_id: m.category_id ?? '', price: m.price ?? '',
      features: m.features ? m.features.join('\n') : '',
    });
    setImage(null); setPreview(m.image_url); setPdfFile(null);
    setPdfName(m.pdf_url ? m.pdf_url.split('/').pop() : '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('visible', form.visible ? '1' : '0');
      fd.append('category_id', form.category_id || '');
      if (form.price) fd.append('price', form.price);
      if (image) fd.append('image', image);
      if (pdfFile) fd.append('pdf', pdfFile);
      if (form.features.trim()) fd.append('features', JSON.stringify(form.features.split('\n').filter((l) => l.trim())));
      if (editing) {
        const res = await updateMachine(editing.id, fd);
        setMachines((prev) => prev.map((m) => (m.id === editing.id ? res.data : m)));
      } else {
        const res = await createMachine(fd);
        setMachines((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch { alert('Error saving machine'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDeleteMachine = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try { await deleteMachine(id); setMachines((prev) => prev.filter((m) => m.id !== id)); }
    catch { alert('Error deleting machine'); }
  };

  const toggleVisible = async (m) => {
    try {
      const fd = new FormData();
      fd.append('visible', m.visible ? '0' : '1');
      fd.append('category_id', m.category_id ?? '');
      const res = await updateMachine(m.id, fd);
      setMachines((prev) => prev.map((x) => (x.id === m.id ? res.data : x)));
    } catch { alert('Error toggling visibility'); }
  };

  if (loading) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Machines</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Image</th><th style={th}>Title</th><th style={th}>Price</th><th style={th}>Category</th><th style={th}>Status</th><th style={th}>Actions</th></tr>
            </thead>
            <tbody>
              {[1,2,3].map((i) => (
                <tr key={i} style={tr}>
                  {[1,2,3,4,5,6].map((j) => (
                    <td key={j} style={td}><div style={{ height:'14px', background:'#1a1a1a', borderRadius:'4px', width: j === 2 ? '140px' : j === 3 ? '80px' : '60px' }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={sectionHeader}>
        <div>
          <h2 style={sectionTitle}>Machines</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>{machines.length} machines</p>
        </div>
        <motion.button
          style={addBtn}
          onClick={openAdd}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight:'6px', verticalAlign:'middle' }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Machine
        </motion.button>
      </div>
      {machines.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom:'16px' }}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p style={{ color: '#888', fontSize:'15px' }}>No machines yet.</p>
          <p style={{ color: '#555', fontSize:'13px', marginTop:'4px' }}>Click "Add Machine" to create one.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Image</th>
                <th style={th}>Title</th>
                <th style={th}>Price</th>
                <th style={th}>Category</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m, i) => (
                <motion.tr
                  key={m.id}
                  custom={i}
                  variants={userRowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: 'rgba(163,122,57,0.04)' }}
                  style={tr}
                >
                  <td style={td}>
                    <img src={m.image_url || 'https://placehold.co/60x40/ccc/333?text=N/A'} alt="" style={thumb} />
                  </td>
                  <td style={{ ...td, fontWeight: '600', color:'#fff' }}>{m.title}</td>
                  <td style={td}>{m.price ? `${parseFloat(m.price).toLocaleString()} MAD` : '-'}</td>
                  <td style={td}>{m.category?.name || '-'}</td>
                  <td style={td}>
                    <span style={{ ...badge, background: m.visible ? '#27ae60' : '#e74c3c', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        {m.visible ? <polyline points="20 6 9 17 4 12" /> : <line x1="1" y1="1" x2="23" y2="23" />}
                      </svg>
                      {m.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <motion.button
                        style={{ ...smallBtn, background:'#555' }}
                        onClick={() => toggleVisible(m)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {m.visible ? 'Hide' : 'Show'}
                      </motion.button>
                      <motion.button
                        style={{ ...smallBtn, background:'#3498db', display:'inline-flex', alignItems:'center', gap:'4px' }}
                        onClick={() => openEdit(m)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                      </motion.button>
                      <motion.button
                        style={{ ...smallBtn, background:'#e74c3c', display:'inline-flex', alignItems:'center', gap:'4px' }}
                        onClick={() => handleDelete(m.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Del
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div style={overlay} onClick={() => setShowModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalTitle}>{editing ? 'Edit Machine' : 'Add Machine'}</h2>
            <label style={label}>Title</label>
            <input style={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Machine name" />
            <label style={label}>Description</label>
            <textarea style={textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Machine description" rows={3} />
            <label style={label}>Category</label>
            <select style={input} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">-- No category --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={label}>Price (MAD)</label>
            <input style={input} type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
            <label style={label}>Image</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; setImage(f); if (f) setPreview(URL.createObjectURL(f)); }} />
            {preview && <img src={preview} alt="" style={previewImg} />}
            <label style={label}>Technical Specs (PDF)</label>
            <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files[0]; setPdfFile(f); if (f) setPdfName(f.name); }} />
            {pdfName && <p style={{ fontSize: '12px', color: '#a37a39', margin: '4px 0 10px' }}>{pdfName}</p>}
            <label style={label}>Exclusive Features (one per line)</label>
            <textarea style={textarea} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="High precision spindle&#10;Automatic tool changer&#10;Water cooling system" rows={4} />
            <label style={{ ...label, marginTop: '10px' }}>
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />{' '}
              Visible to users
            </label>
            <div style={modalActions}>
              <button style={cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={saveBtn} onClick={handleSave} disabled={saving || !form.title.trim() || !form.description.trim()}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm !== null}
        onConfirm={confirmDeleteMachine}
        onCancel={() => setDeleteConfirm(null)}
        title="Delete this machine?"
        message="This action cannot be undone. The machine and all related data will be permanently removed."
      />
    </>
  );
}

/* ---------- Category Manager ---------- */
function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => { getCategories().then((res) => setCategories(res.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setName(''); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setName(c.name); setShowModal(true); };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData(); fd.append('name', name);
      if (editing) await updateCategory(editing.id, fd); else await createCategory(fd);
      load(); setShowModal(false);
    } catch { alert('Error saving category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDeleteCategory = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try { await deleteCategory(id); load(); } catch { alert('Error deleting category'); }
  };

  if (loading) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Categories</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Name</th><th style={th}>Machines</th><th style={th}>Actions</th></tr>
            </thead>
            <tbody>
              {[1,2,3].map((i) => (
                <tr key={i} style={tr}>
                  {[1,2,3].map((j) => (
                    <td key={j} style={td}><div style={{ height:'14px', background:'#1a1a1a', borderRadius:'4px', width: j === 1 ? '140px' : '60px' }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={sectionHeader}>
        <div>
          <h2 style={sectionTitle}>Categories</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>{categories.length} categories</p>
        </div>
        <motion.button
          style={addBtn}
          onClick={openAdd}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight:'6px', verticalAlign:'middle' }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </motion.button>
      </div>
      {categories.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom:'16px' }}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p style={{ color: '#888', fontSize:'15px' }}>No categories yet.</p>
          <p style={{ color: '#555', fontSize:'13px', marginTop:'4px' }}>Click "Add Category" to create one.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Machines</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <motion.tr
                  key={c.id}
                  custom={i}
                  variants={userRowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: 'rgba(163,122,57,0.04)' }}
                  style={tr}
                >
                  <td style={{ ...td, fontWeight: '600', color:'#fff' }}>{c.name}</td>
                  <td style={td}>
                    <span style={{ color:'#a37a39', fontWeight:700 }}>{c.machines?.length || 0}</span>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <motion.button
                        style={{ ...smallBtn, background:'#3498db', display:'inline-flex', alignItems:'center', gap:'4px' }}
                        onClick={() => openEdit(c)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                      </motion.button>
                      <motion.button
                        style={{ ...smallBtn, background:'#e74c3c', display:'inline-flex', alignItems:'center', gap:'4px' }}
                        onClick={() => handleDelete(c.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Del
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div style={overlay} onClick={() => setShowModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalTitle}>{editing ? 'Edit Category' : 'Add Category'}</h2>
            <label style={label}>Name</label>
            <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            <div style={modalActions}>
              <button style={cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={saveBtn} onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm !== null}
        onConfirm={confirmDeleteCategory}
        onCancel={() => setDeleteConfirm(null)}
        title="Delete this category?"
        message="This action cannot be undone. All machines in this category will be affected."
      />
    </>
  );
}

/* ---------- Visitors Manager ---------- */
function VisitorsManager() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const load = (p = 1) => {
    setLoading(true);
    getVisitors(p, 50).then((res) => {
      setVisitors(res.data.data || []);
      setLastPage(res.data.last_page || 1);
      setPage(res.data.current_page || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const getDeviceIcon = (ua) => {
    if (!ua) return 'desktop';
    const u = ua.toLowerCase();
    if (u.includes('mobile') || u.includes('iphone') || u.includes('android')) return 'mobile';
    if (u.includes('tablet') || u.includes('ipad')) return 'tablet';
    if (u.includes('bot') || u.includes('crawler') || u.includes('spider')) return 'bot';
    return 'desktop';
  };

  const deviceSvgs = {
    desktop: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    mobile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    tablet: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    bot: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  };

  if (loading) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Visitors</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Device</th><th style={th}>IP Address</th><th style={th}>Location</th><th style={th}>Page</th><th style={th}>Visited At</th></tr>
            </thead>
            <tbody>
              {[1,2,3,4].map((i) => (
                <tr key={i} style={tr}>
                  {[1,2,3,4,5].map((j) => (
                    <td key={j} style={td}><div style={{ height:'14px', background:'#1a1a1a', borderRadius:'4px', width: j === 2 ? '120px' : j === 4 ? '160px' : '80px' }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={sectionHeader}>
        <div>
          <h2 style={sectionTitle}>Visitors</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>Recent site visitors</p>
        </div>
        <motion.button
          style={{ ...smallBtn, background:'#a37a39', display:'inline-flex', alignItems:'center', gap:'6px' }}
          onClick={() => load()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          Refresh
        </motion.button>
      </div>
      {visitors.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom:'16px' }}>
            <circle cx="12" cy="12" r="2" /><path d="M12 20c-4.42 0-8-4-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
          <p style={{ color: '#888', fontSize:'15px' }}>No visitors recorded yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(12px, 1.2vw, 14px)', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#111', color: '#d4af37', textAlign: 'left' }}>
                <th style={thStyle}>Device</th>
                <th style={thStyle}>IP Address</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Page</th>
                <th style={thStyle}>Visited At</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <motion.tr
                  key={v.id}
                  custom={i}
                  variants={userRowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: 'rgba(163,122,57,0.04)' }}
                  style={{ borderBottom: '1px solid #222' }}
                >
                  <td style={tdStyle} title={v.user_agent || ''}>
                    {deviceSvgs[getDeviceIcon(v.user_agent)] || deviceSvgs.desktop}
                  </td>
                  <td style={tdStyle}>{v.ip_address || '-'}</td>
                  <td style={tdStyle}>{[v.city, v.country].filter(Boolean).join(', ') || '-'}</td>
                  <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.page_url}>{v.page_url || '/'}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{new Date(v.visited_at).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {lastPage > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems:'center', gap: '8px', marginTop: '20px' }}>
              <motion.button
                style={{ ...smallBtn, opacity: page <= 1 ? 0.5 : 1 }}
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                whileHover={page > 1 ? { scale: 1.05 } : {}}
                whileTap={page > 1 ? { scale: 0.95 } : {}}
              >
                Prev
              </motion.button>
              <span style={{ color: '#888', padding: '5px 10px', fontSize:'13px' }}>
                Page {page} of {lastPage}
              </span>
              <motion.button
                style={{ ...smallBtn, opacity: page >= lastPage ? 0.5 : 1 }}
                disabled={page >= lastPage}
                onClick={() => load(page + 1)}
                whileHover={page < lastPage ? { scale: 1.05 } : {}}
                whileTap={page < lastPage ? { scale: 0.95 } : {}}
              >
                Next
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Messages Manager ---------- */
function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMsg, setViewMsg] = useState(null);

  useEffect(() => {
    getMessages().then((res) => setMessages(res.data))
      .catch(() => setMessages([])).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Messages</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Date</th><th style={th}>Name</th><th style={th}>Email</th><th style={th}>Message</th></tr>
            </thead>
            <tbody>
              {[1,2,3].map((i) => (
                <tr key={i} style={tr}>
                  {[1,2,3,4].map((j) => (
                    <td key={j} style={td}><div style={{ height:'14px', background:'#1a1a1a', borderRadius:'4px', width: j === 1 ? '140px' : j === 2 ? '100px' : j === 3 ? '160px' : '200px' }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const truncate = (text, len = 60) => text.length > len ? text.slice(0, len) + '...' : text;

  if (messages.length === 0) {
    return (
      <div>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Messages</h2>
        </div>
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom:'16px' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p style={{ color: '#888', fontSize:'15px' }}>No messages yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={sectionHeader}>
        <div>
          <h2 style={sectionTitle}>Messages</h2>
          <p style={{ color: '#777', fontSize: '13px', margin: '4px 0 0' }}>{messages.length} messages</p>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(13px, 1.2vw, 15px)', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#111', color: '#d4af37', textAlign: 'left' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m, i) => (
              <motion.tr
                key={m.id}
                custom={i}
                variants={userRowVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ backgroundColor: 'rgba(163,122,57,0.04)' }}
                style={{ borderBottom: '1px solid #222' }}
              >
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleString()}</td>
                <td style={tdStyle}>{m.first_name} {m.last_name}</td>
                <td style={tdStyle}>{m.email}</td>
                <td style={tdStyle}>
                  <span style={{ color:'#bbb' }}>{truncate(m.message)}</span>
                  {m.message.length > 60 && (
                    <motion.span
                      onClick={() => setViewMsg(m)}
                      style={{ color: '#d4af37', cursor: 'pointer', fontWeight: '600', marginLeft: '6px', fontSize: '12px' }}
                      whileHover={{ opacity: 0.7 }}
                    >
                      Read all
                    </motion.span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewMsg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={msgOverlay}
          onClick={() => setViewMsg(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={msgPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={msgHeader}>
              <strong>{viewMsg.first_name} {viewMsg.last_name}</strong>
              <span style={{ color: '#999', fontSize: '13px' }}>{new Date(viewMsg.created_at).toLocaleString()}</span>
            </div>
            <div style={{ marginTop:'4px', color:'#888', fontSize:'13px' }}>{viewMsg.email}</div>
            <p style={{ color: '#e0e0e0', fontSize: '15px', lineHeight: 1.7, margin: '16px 0 0' }}>{viewMsg.message}</p>
            <motion.button
              onClick={() => setViewMsg(null)}
              style={msgClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Shared Styles ---------- */
const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(12px, 2vw, 20px)' };
const sectionTitle = { fontSize: 'clamp(20px, 3vw, 24px)', color: '#d4af37', margin: 0 };
const addBtn = { background: '#a37a39', color: '#fff', border: 'none', padding: 'clamp(8px, 1.2vw, 10px) clamp(14px, 2vw, 20px)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: 'clamp(13px, 1.3vw, 15px)', whiteSpace: 'nowrap' };
const smallBtn = { background: '#555', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' };
const badge = { display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', color: '#fff' };
const table = { width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(12px, 1.3vw, 14px)' };
const th = { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #a37a39', color: '#d4af37', fontWeight: '700', whiteSpace: 'nowrap', background: '#111' };
const tr = { borderBottom: '1px solid #222' };
const td = { padding: '10px 12px', color: '#ccc' };
const thumb = { width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', display: 'block', border: '1px solid #333' };
const overlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' };
const modal = { background: '#111', borderRadius: '10px', padding: 'clamp(20px, 3vw, 30px)', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #a37a39' };
const modalTitle = { fontSize: 'clamp(18px, 2.5vw, 22px)', marginBottom: 'clamp(16px, 2vw, 24px)', color: '#d4af37' };
const label = { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#ccc', fontSize: 'clamp(13px, 1.3vw, 14px)' };
const input = { width: '100%', padding: 'clamp(8px, 1.2vw, 10px)', marginBottom: 'clamp(10px, 1.5vw, 15px)', border: '1px solid #444', borderRadius: '5px', fontSize: 'clamp(13px, 1.3vw, 14px)', background: '#1a1a1a', color: '#fff' };
const textarea = { width: '100%', padding: 'clamp(8px, 1.2vw, 10px)', marginBottom: 'clamp(10px, 1.5vw, 15px)', border: '1px solid #444', borderRadius: '5px', resize: 'vertical', fontSize: 'clamp(13px, 1.3vw, 14px)', fontFamily: 'inherit', background: '#1a1a1a', color: '#fff' };
const previewImg = { width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px', marginBottom: 'clamp(8px, 1.2vw, 12px)' };
const modalActions = { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: 'clamp(16px, 2vw, 20px)' };
const cancelBtn = { background: '#333', color: '#ccc', border: '1px solid #555', padding: 'clamp(8px, 1.2vw, 10px) clamp(16px, 2.5vw, 24px)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: 'clamp(13px, 1.3vw, 14px)' };
const saveBtn = { background: '#a37a39', color: '#fff', border: 'none', padding: 'clamp(8px, 1.2vw, 10px) clamp(16px, 2.5vw, 24px)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: 'clamp(13px, 1.3vw, 14px)' };
/* ---------- Pending Registration Styles ---------- */
const pendingHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px, 2.5vw, 24px)', flexWrap: 'wrap', gap: '12px' };
const countBadge = { background: '#a37a39', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'clamp(14px, 2vw, 20px)' };
const userCard = { background: 'linear-gradient(145deg, #0d0d0d, #161616)', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' };
const cardTop = { display: 'flex', alignItems: 'center', gap: '14px', padding: 'clamp(16px, 2vw, 20px) clamp(16px, 2vw, 20px) 0' };
const userAvatar = { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #a37a39, #c8952e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '20px', flexShrink: 0 };
const userInfo = { minWidth: 0 };
const userName = { color: '#fff', fontSize: 'clamp(15px, 1.5vw, 17px)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const userEmail = { color: '#888', fontSize: '13px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const userCompany = { color: '#d4af37', fontSize: '13px', fontWeight: '600', marginTop: '1px' };
const cardDivider = { height: '1px', background: 'linear-gradient(90deg, transparent, #a37a39, transparent)', margin: 'clamp(12px, 2vw, 16px) 0' };
const cardBody = { padding: '0 clamp(16px, 2vw, 20px)' };
const infoRow = { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 'clamp(13px, 1.2vw, 14px)' };
const infoLabel = { color: '#777' };
const infoValue = { color: '#ccc', fontWeight: '600', textAlign: 'right' };
const bioBox = { margin: 'clamp(10px, 1.5vw, 14px) clamp(16px, 2vw, 20px) 0', padding: 'clamp(10px, 1.5vw, 14px)', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #222' };
const bioLabel = { color: '#a37a39', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '6px' };
const bioText = { color: '#aaa', fontSize: '13px', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' };
const imagesBox = { margin: 'clamp(10px, 1.5vw, 14px) clamp(16px, 2vw, 20px) 0' };
const imageGrid = { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' };
const thumbImg = { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #333', cursor: 'pointer' };
const cardActions = { display: 'flex', gap: '10px', padding: 'clamp(16px, 2vw, 20px)', marginTop: '4px' };
const approveBtn = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2e7d32, #43a047)', color: '#fff', border: 'none', padding: 'clamp(10px, 1.5vw, 12px)', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: 'clamp(13px, 1.2vw, 14px)' };
const rejectBtn = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #b71c1c, #e53935)', color: '#fff', border: 'none', padding: 'clamp(10px, 1.5vw, 12px)', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: 'clamp(13px, 1.2vw, 14px)' };
const retryBtn = { background: '#a37a39', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' };
const paginationRow = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: 'clamp(20px, 3vw, 32px)', paddingBottom: '8px' };
const paginationInfo = { color: '#777', fontSize: '13px' };
const paginationBtns = { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' };
const pageBtn = (disabled) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid ' + (disabled ? '#333' : '#555'), background: disabled ? '#111' : '#1a1a1a', color: disabled ? '#555' : '#ccc', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', opacity: disabled ? 0.5 : 1 });
const pageNumBtn = (active) => ({ width: '34px', height: '34px', borderRadius: '6px', border: active ? '1px solid #a37a39' : '1px solid #333', background: active ? 'rgba(163,122,57,0.2)' : '#111', color: active ? '#d4af37' : '#888', cursor: 'pointer', fontWeight: active ? '700' : '500', fontSize: '13px' });
const lightboxOverlay = { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', cursor: 'zoom-out' };

/* ---------- Skeleton ---------- */
const skeletonCard = { background: '#0d0d0d', border: '1px solid #222', borderRadius: '12px', padding: '20px' };
const skeletonAvatar = { width: '48px', height: '48px', borderRadius: '50%', background: '#222', marginBottom: '16px' };
const skeletonLine = { height: '14px', background: '#222', borderRadius: '4px', marginBottom: '10px', width: '80%' };

const msgOverlay = { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' };
const msgPopup = { background: '#000', border: '2px solid #a37a39', borderRadius: '10px', padding: 'clamp(20px, 3vw, 36px)', maxWidth: '520px', width: '90%', margin: '0 16px' };
const msgHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#d4af37', fontSize: '15px', fontWeight: '700', flexWrap: 'wrap', gap: '8px' };
const msgClose = { marginTop: '20px', background: '#a37a39', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' };
