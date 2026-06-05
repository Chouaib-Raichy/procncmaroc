import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  getAdminMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  getImageUrl,
} from '../api/machines';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import { getMessages } from '../api/contacts';

const tabs = ['Machines', 'Categories', 'Messages'];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Machines');

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="page-section dashboard-page">
      <div style={styles.header}>
        <h1 className="section-title" style={{ marginBottom: '5px' }}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Welcome back, {user.name}</p>
      </div>

      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t}
            style={{ ...styles.tab, borderBottom: activeTab === t ? '3px solid #a37a39' : '3px solid transparent', color: activeTab === t ? '#a37a39' : '#666' }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Machines' ? <MachineManager /> : activeTab === 'Categories' ? <CategoryManager /> : <MessagesManager />}
    </div>
  );
}

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
      title: m.title,
      description: m.description,
      visible: m.visible,
      category_id: m.category_id ?? '',
      price: m.price ?? '',
      features: m.features ? m.features.join('\n') : '',
    });
    setImage(null);
    setPreview(getImageUrl(m.image));
    setPdfFile(null);
    setPdfName(m.pdf ? m.pdf.split('/').pop() : '');
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
      if (form.features.trim()) {
        const lines = form.features.split('\n').filter((l) => l.trim());
        fd.append('features', JSON.stringify(lines));
      }

      let res;
      if (editing) {
        res = await updateMachine(editing.id, fd);
        setMachines((prev) => prev.map((m) => (m.id === editing.id ? res.data : m)));
      } else {
        res = await createMachine(fd);
        setMachines((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch { alert('Error saving machine'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine?')) return;
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
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Machines <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({machines.length})</span></h2>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Machine</button>
      </div>

      {machines.length === 0 ? (
        <p style={{ color: '#777', padding: '20px 0' }}>No machines yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => (
                <tr key={m.id} style={styles.tr}>
                  <td style={styles.td}>
                    <img src={getImageUrl(m.image) || 'https://placehold.co/60x40/ccc/333?text=N/A'} alt="" style={styles.thumb} />
                  </td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{m.title}</td>
                  <td style={styles.td}>{m.price ? `${parseFloat(m.price).toLocaleString()} MAD` : '-'}</td>
                  <td style={styles.td}>{m.category?.name || '-'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: m.visible ? '#27ae60' : '#e74c3c' }}>
                      {m.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button style={styles.smallBtn} onClick={() => toggleVisible(m)}>{m.visible ? 'Hide' : 'Show'}</button>
                      <button style={{ ...styles.smallBtn, background: '#3498db' }} onClick={() => openEdit(m)}>Edit</button>
                      <button style={{ ...styles.smallBtn, background: '#e74c3c' }} onClick={() => handleDelete(m.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editing ? 'Edit Machine' : 'Add Machine'}</h2>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Machine name" />
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Machine description" rows={3} />
            <label style={styles.label}>Category</label>
            <select style={styles.input} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">-- No category --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={styles.label}>Price (MAD)</label>
            <input style={styles.input} type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
            <label style={styles.label}>Image</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; setImage(f); if (f) setPreview(URL.createObjectURL(f)); }} />
            {preview && <img src={preview} alt="" style={styles.previewImg} />}
            <label style={styles.label}>Technical Specs (PDF)</label>
            <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files[0]; setPdfFile(f); if (f) setPdfName(f.name); }} />
            {pdfName && <p style={{ fontSize: '12px', color: '#a37a39', margin: '4px 0 10px' }}>{pdfName}</p>}
            <label style={styles.label}>Exclusive Features (one per line)</label>
            <textarea style={styles.textarea} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="High precision spindle&#10;Automatic tool changer&#10;Water cooling system" rows={4} />
            <label style={{ ...styles.label, marginTop: '10px' }}>
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />{' '}
              Visible to users
            </label>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving || !form.title.trim() || !form.description.trim()}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { getCategories().then((res) => setCategories(res.data)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setName(''); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setName(c.name); setShowModal(true); };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      if (editing) await updateCategory(editing.id, fd); else await createCategory(fd);
      load();
      setShowModal(false);
    } catch { alert('Error saving category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); load(); }
    catch { alert('Error deleting category'); }
  };

  return (
    <>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Categories <span style={{fontSize:'14px',color:'#999',fontWeight:'400'}}>({categories.length})</span></h2>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Category</button>
      </div>

      {categories.length === 0 ? (
        <p style={{ color: '#777', padding: '20px 0' }}>No categories yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Machines</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{c.name}</td>
                  <td style={styles.td}>{c.machines?.length || 0}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ ...styles.smallBtn, background: '#3498db' }} onClick={() => openEdit(c)}>Edit</button>
                      <button style={{ ...styles.smallBtn, background: '#e74c3c' }} onClick={() => handleDelete(c.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editing ? 'Edit Category' : 'Add Category'}</h2>
            <label style={styles.label}>Name</label>
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  header: { marginBottom: 'clamp(16px, 3vw, 30px)' },
  subtitle: { color: '#aaa', fontSize: 'clamp(14px, 1.8vw, 16px)' },
  tabs: { display: 'flex', gap: 'clamp(16px, 3vw, 30px)', marginBottom: 'clamp(20px, 3vw, 30px)', borderBottom: '1px solid #333' },
  tab: { background: 'none', border: 'none', padding: 'clamp(8px, 1.2vw, 12px) 0', fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: '600', cursor: 'pointer' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(12px, 2vw, 20px)' },
  sectionTitle: { fontSize: 'clamp(20px, 3vw, 24px)', color: '#d4af37', margin: 0 },
  addBtn: { background: '#a37a39', color: '#fff', border: 'none', padding: 'clamp(8px, 1.2vw, 10px) clamp(14px, 2vw, 20px)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: 'clamp(13px, 1.3vw, 15px)', whiteSpace: 'nowrap' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(12px, 1.3vw, 14px)' },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #a37a39', color: '#d4af37', fontWeight: '700', whiteSpace: 'nowrap', background: '#111' },
  tr: { borderBottom: '1px solid #222' },
  td: { padding: '10px 12px', color: '#ccc' },
  thumb: { width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', display: 'block', border: '1px solid #333' },
  badge: { display: 'inline-block', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: '600' },
  smallBtn: { background: '#333', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: 'clamp(11px, 1.1vw, 12px)', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
  modal: { background: '#111', borderRadius: '10px', padding: 'clamp(20px, 3vw, 30px)', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #a37a39' },
  modalTitle: { fontSize: 'clamp(18px, 2.5vw, 22px)', marginBottom: 'clamp(16px, 2vw, 24px)', color: '#d4af37' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#ccc', fontSize: 'clamp(13px, 1.3vw, 14px)' },
  input: { width: '100%', padding: 'clamp(8px, 1.2vw, 10px)', marginBottom: 'clamp(10px, 1.5vw, 15px)', border: '1px solid #444', borderRadius: '5px', fontSize: 'clamp(13px, 1.3vw, 14px)', background: '#1a1a1a', color: '#fff' },
  textarea: { width: '100%', padding: 'clamp(8px, 1.2vw, 10px)', marginBottom: 'clamp(10px, 1.5vw, 15px)', border: '1px solid #444', borderRadius: '5px', resize: 'vertical', fontSize: 'clamp(13px, 1.3vw, 14px)', fontFamily: 'inherit', background: '#1a1a1a', color: '#fff' },
  previewImg: { width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px', marginBottom: 'clamp(8px, 1.2vw, 12px)' },
  modalActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: 'clamp(16px, 2vw, 20px)' },
  cancelBtn: { background: '#333', color: '#ccc', border: '1px solid #555', padding: 'clamp(8px, 1.2vw, 10px) clamp(16px, 2.5vw, 24px)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: 'clamp(13px, 1.3vw, 14px)' },
  saveBtn: { background: '#a37a39', color: '#fff', border: 'none', padding: 'clamp(8px, 1.2vw, 10px) clamp(16px, 2.5vw, 24px)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: 'clamp(13px, 1.3vw, 14px)' },
};

function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMsg, setViewMsg] = useState(null);

  useEffect(() => {
    getMessages()
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>Loading messages...</p>;

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

const thStyle = { padding: '12px 16px', fontWeight: '700', borderBottom: '2px solid #a37a39' };
const tdStyle = { padding: '12px 16px', color: '#ccc', verticalAlign: 'top', borderBottom: '1px solid #222' };
const msgOverlay = {
  position: 'fixed', inset: 0, zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.7)',
};
const msgPopup = {
  background: '#000', border: '2px solid #a37a39', borderRadius: '10px',
  padding: 'clamp(20px, 3vw, 36px)', maxWidth: '520px', width: '90%', margin: '0 16px',
};
const msgHeader = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  color: '#d4af37', fontSize: '15px', fontWeight: '700', flexWrap: 'wrap', gap: '8px',
};
const msgClose = {
  marginTop: '20px', background: '#a37a39', color: '#fff', border: 'none',
  padding: '8px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
};
