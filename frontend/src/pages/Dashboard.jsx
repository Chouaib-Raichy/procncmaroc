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
import { getVisitors } from '../api/visitors';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const sidebarItems = [
  { key: 'users', label: 'Users', icon: '👥' },
  { key: 'visitors', label: 'Visitors', icon: '🌐' },
  { key: 'machines', label: 'Machines', icon: '⚙️' },
  { key: 'categories', label: 'Categories', icon: '📁' },
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'messages', label: 'Messages', icon: '✉️' },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
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
        {activeTab === 'users' ? <UsersManager /> :
         activeTab === 'visitors' ? <VisitorsManager /> :
         activeTab === 'machines' ? <MachineManager /> :
         activeTab === 'categories' ? <CategoryManager /> :
          activeTab === 'pending' ? <PendingRegistrations /> :
          activeTab === 'messages' ? <MessagesManager /> : null}
      </div>
    </div>
  );
}

const thStyle = { padding: '10px 12px', color: '#d4af37', fontWeight: 700, textAlign: 'left', background: '#111', whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 12px', color: '#ccc' };

/* ---------- Users Manager ---------- */
function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);

  const load = () => { getUsers().then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleToggleBan = async (id) => {
    try { await toggleBanUser(id); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleViewProfile = (u) => setViewingUser(u);

  if (loading) return <Loading text="Loading users..." />;

  return (
    <div>
      <h2 style={sectionTitle}>Registered Users <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({users.length})</span></h2>
      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
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
            {users.map((u) => (
              <tr key={u.id} style={tr}>
                <td style={td}>{u.id}</td>
                <td style={{ ...td, fontWeight: '600' }}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={td}><span style={{ color: u.role === 'admin' ? '#d4af37' : '#888', fontWeight: u.role === 'admin' ? 700 : 400 }}>{u.role}</span></td>
                <td style={td}>
                  {u.banned_at ? (
                    <span style={{ ...badge, background: '#e74c3c' }}>Banned</span>
                  ) : (
                    <span style={{ ...badge, background: '#27ae60' }}>Active</span>
                  )}
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button style={{ ...smallBtn, background: '#3498db' }} onClick={() => handleViewProfile(u)}>Profile</button>
                    {u.role !== 'admin' && (
                      <button style={{ ...smallBtn, background: u.banned_at ? '#27ae60' : '#e74c3c' }} onClick={() => handleToggleBan(u.id)}>
                        {u.banned_at ? 'Unban' : 'Ban'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Profile Modal */}
      {viewingUser && (
        <div style={overlay} onClick={() => setViewingUser(null)}>
          <div style={{ ...modal, maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalTitle}>{viewingUser.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '14px', color: '#ccc' }}>
              <div><strong style={{ color: '#d4af37' }}>Email:</strong> {viewingUser.email}</div>
              <div><strong style={{ color: '#d4af37' }}>Role:</strong> {viewingUser.role}</div>
              <div><strong style={{ color: '#d4af37' }}>Registered:</strong> {new Date(viewingUser.created_at).toLocaleDateString()}</div>
              <div><strong style={{ color: '#d4af37' }}>Last Active:</strong> {viewingUser.last_activity_at ? new Date(viewingUser.last_activity_at).toLocaleString() : 'Never'}</div>

              <div><strong style={{ color: '#d4af37' }}>Status:</strong> {viewingUser.banned_at ? 'Banned' : 'Active'}</div>
            </div>
            <button style={saveBtn} onClick={() => setViewingUser(null)}>Close</button>
          </div>
        </div>
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

  const fetch = () => {
    setLoading(true);
    setError(null);
    getPendingUsers().then((res) => setUsers(res.data)).catch(() => setError('Failed to load pending users')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

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

  if (loading) return (
    <div>
      <div style={pendingHeader}>
        <h2 style={sectionTitle}>Pending Registrations</h2>
      </div>
      <div style={cardGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={skeletonCard}>
            <div style={skeletonAvatar} />
            <div style={skeletonLine} />
            <div style={{ ...skeletonLine, width: '60%' }} />
            <div style={{ ...skeletonLine, width: '40%' }} />
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
        <button onClick={fetch} style={retryBtn}>Try Again</button>
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
        <h2 style={sectionTitle}>Pending Registrations</h2>
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

      <div style={cardGrid}>
        <AnimatePresence>
          {users.map((u, idx) => (
            <motion.div
              key={u.id}
              style={userCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              layout
            >
              <div style={cardTop}>
                <div style={userAvatar}>{u.name?.charAt(0).toUpperCase()}</div>
                <div style={userInfo}>
                  <div style={userName}>{u.name}</div>
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
                        whileHover={{ scale: 1.05 }}
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
      </div>
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

  const load = () => {
    getAdminMachines().then((res) => setMachines(res.data)).catch(() => {});
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
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

  return (
    <>
      <div style={sectionHeader}>
        <h2 style={sectionTitle}>Machines <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({machines.length})</span></h2>
        <button style={addBtn} onClick={openAdd}>+ Add Machine</button>
      </div>
      {machines.length === 0 ? (
        <p style={{ color: '#777', padding: '20px 0' }}>No machines yet.</p>
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
              {machines.map((m) => (
                <tr key={m.id} style={tr}>
                  <td style={td}><img src={m.image_url || 'https://placehold.co/60x40/ccc/333?text=N/A'} alt="" style={thumb} /></td>
                  <td style={{ ...td, fontWeight: '600' }}>{m.title}</td>
                  <td style={td}>{m.price ? `${parseFloat(m.price).toLocaleString()} MAD` : '-'}</td>
                  <td style={td}>{m.category?.name || '-'}</td>
                  <td style={td}><span style={{ ...badge, background: m.visible ? '#27ae60' : '#e74c3c' }}>{m.visible ? 'Visible' : 'Hidden'}</span></td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button style={smallBtn} onClick={() => toggleVisible(m)}>{m.visible ? 'Hide' : 'Show'}</button>
                      <button style={{ ...smallBtn, background: '#3498db' }} onClick={() => openEdit(m)}>Edit</button>
                      <button style={{ ...smallBtn, background: '#e74c3c' }} onClick={() => handleDelete(m.id)}>Del</button>
                    </div>
                  </td>
                </tr>
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

  const load = () => { getCategories().then((res) => setCategories(res.data)).catch(() => {}); };
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

  return (
    <>
      <div style={sectionHeader}>
        <h2 style={sectionTitle}>Categories <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({categories.length})</span></h2>
        <button style={addBtn} onClick={openAdd}>+ Add Category</button>
      </div>
      {categories.length === 0 ? (
        <p style={{ color: '#777', padding: '20px 0' }}>No categories yet.</p>
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
              {categories.map((c) => (
                <tr key={c.id} style={tr}>
                  <td style={{ ...td, fontWeight: '600' }}>{c.name}</td>
                  <td style={td}>{c.machines?.length || 0}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ ...smallBtn, background: '#3498db' }} onClick={() => openEdit(c)}>Edit</button>
                      <button style={{ ...smallBtn, background: '#e74c3c' }} onClick={() => handleDelete(c.id)}>Del</button>
                    </div>
                  </td>
                </tr>
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

  if (loading) return <Loading text="Loading visitors..." />;

  const getDeviceIcon = (ua) => {
    if (!ua) return '🖥️';
    const u = ua.toLowerCase();
    if (u.includes('mobile') || u.includes('iphone') || u.includes('android')) return '📱';
    if (u.includes('tablet') || u.includes('ipad')) return '📟';
    if (u.includes('bot') || u.includes('crawler') || u.includes('spider')) return '🤖';
    return '🖥️';
  };

  return (
    <div>
      <div style={sectionHeader}>
        <h2 style={sectionTitle}>Visitors <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({visitors.length})</span></h2>
        <button style={{ ...smallBtn, background: '#a37a39' }} onClick={() => load()}>Refresh</button>
      </div>
      {visitors.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>No visitors recorded yet.</p>
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
              {visitors.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={tdStyle} title={v.user_agent || ''}>{getDeviceIcon(v.user_agent)}</td>
                  <td style={tdStyle}>{v.ip_address || '-'}</td>
                  <td style={tdStyle}>{[v.city, v.country].filter(Boolean).join(', ') || '-'}</td>
                  <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.page_url || '/'}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{new Date(v.visited_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lastPage > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button style={{ ...smallBtn }} disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
              <span style={{ color: '#888', padding: '5px 10px' }}>{page} / {lastPage}</span>
              <button style={{ ...smallBtn }} disabled={page >= lastPage} onClick={() => load(page + 1)}>Next</button>
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

  if (loading) return <Loading text="Loading messages..." />;
  if (messages.length === 0) return <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>No messages yet.</p>;

  const truncate = (text, len = 50) => text.length > len ? text.slice(0, len) + '...' : text;

  return (
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
          {messages.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={tdStyle}>{new Date(m.created_at).toLocaleString()}</td>
              <td style={tdStyle}>{m.first_name} {m.last_name}</td>
              <td style={tdStyle}>{m.email}</td>
              <td style={tdStyle}>
                {truncate(m.message)}
                {m.message.length > 50 && (
                  <span onClick={() => setViewMsg(m)} style={{ color: '#a37a39', cursor: 'pointer', fontWeight: '600', marginLeft: '6px', fontSize: '12px' }}>View all</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewMsg && (
        <div style={msgOverlay} onClick={() => setViewMsg(null)}>
          <div style={msgPopup} onClick={(e) => e.stopPropagation()}>
            <div style={msgHeader}>
              <strong>{viewMsg.first_name} {viewMsg.last_name}</strong>
              <span style={{ color: '#999', fontSize: '13px' }}>{new Date(viewMsg.created_at).toLocaleString()}</span>
            </div>
            <p style={{ color: '#fff', fontSize: '15px', lineHeight: 1.7, margin: '16px 0 0' }}>{viewMsg.message}</p>
            <button onClick={() => setViewMsg(null)} style={msgClose}>Close</button>
          </div>
        </div>
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
const lightboxOverlay = { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', cursor: 'zoom-out' };

/* ---------- Skeleton ---------- */
const skeletonCard = { background: '#0d0d0d', border: '1px solid #222', borderRadius: '12px', padding: '20px' };
const skeletonAvatar = { width: '48px', height: '48px', borderRadius: '50%', background: '#222', marginBottom: '16px' };
const skeletonLine = { height: '14px', background: '#222', borderRadius: '4px', marginBottom: '10px', width: '80%' };

const msgOverlay = { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' };
const msgPopup = { background: '#000', border: '2px solid #a37a39', borderRadius: '10px', padding: 'clamp(20px, 3vw, 36px)', maxWidth: '520px', width: '90%', margin: '0 16px' };
const msgHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#d4af37', fontSize: '15px', fontWeight: '700', flexWrap: 'wrap', gap: '8px' };
const msgClose = { marginTop: '20px', background: '#a37a39', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' };
