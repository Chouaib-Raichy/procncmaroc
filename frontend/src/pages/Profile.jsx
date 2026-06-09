import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import Loading from '../components/Loading';

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBusinessLocation(user.business_location || '');
    }
  }, [user]);

  if (loading) return <Loading text="Loading profile..." />;
  if (!user) return <Navigate to="/login" replace />;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatar(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const fd = new FormData();
      if (name !== user.name) fd.append('name', name);
      if (email !== user.email) fd.append('email', email);
      if (phone !== (user.phone || '')) fd.append('phone', phone);
      if (businessLocation !== (user.business_location || '')) fd.append('business_location', businessLocation);
      if (password) {
        fd.append('password', password);
        fd.append('password_confirmation', passwordConfirmation);
      }
      if (avatar) fd.append('avatar', avatar);
      const res = await updateProfile(fd);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setPasswordConfirmation('');
      setAvatar(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    } catch (err) {
      const data = err.response?.data;
      const msgText = data?.message || Object.values(data?.errors || {}).flat().join(', ') || 'Update failed';
      setMsg({ type: 'error', text: msgText });
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = preview || user.avatar_url;

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: 'clamp(20px, 4vw, 60px)' }}>
      <div style={{
        maxWidth: '700px', margin: '0 auto',
      }}>
        <div style={{
          background: '#0a0a0a', border: '1px solid #a37a39', borderRadius: '12px',
          padding: 'clamp(24px, 3vw, 40px)',
        }}>
          <h1 style={{ color: '#a37a39', fontSize: 'clamp(24px, 3.5vw, 32px)', marginBottom: '8px', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
            Personal Information
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Manage your account information</p>

          {msg && (
            <div style={{
              padding: '12px 16px', borderRadius: '6px', marginBottom: '20px',
              background: msg.type === 'success' ? '#0d2a0d' : '#2a0d0d',
              border: `1px solid ${msg.type === 'success' ? '#2e7d32' : '#c62828'}`,
              color: msg.type === 'success' ? '#81c784' : '#ef9a9a', fontSize: '14px',
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '120px', height: '120px', borderRadius: '50%',
                  border: '3px solid #a37a39', overflow: 'hidden',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#111', position: 'relative',
                }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#a37a39', fontSize: '40px', fontWeight: 700 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px',
                  padding: '4px 0', textAlign: 'center',
                }}>
                  Change
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <span style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Click to upload (max 50MB)</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone</label>
              <PhoneInput value={phone} onChange={(v) => setPhone(v)} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Location</label>
              <input value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>New Password (leave blank to keep current)</label>
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ color: '#a37a39', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
              <input type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, #a37a39, #d4af37)',
              color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '6px',
  border: '1px solid #333', background: '#111', color: '#fff',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};
