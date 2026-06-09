import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import ConfirmModal from '../components/ConfirmModal';
import { getComments, addComment, togglePostLike, getPostLikes } from '../api/gallery';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';

function ImageCarousel({ images, title, onImageClick }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  return (
    <div style={styles.carousel}>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx]} alt={`${title} ${idx + 1}`} style={styles.carouselImg}
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }} onClick={() => onImageClick(images[idx])} />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button style={{...styles.navBtn, left: '6px'}} onClick={prev} aria-label="Previous">&#10094;</button>
          <button style={{...styles.navBtn, right: '6px'}} onClick={next} aria-label="Next">&#10095;</button>
          <div style={styles.dots}>
            {images.map((_, i) => (
              <span key={i} style={{...styles.dot, background: i === idx ? '#a37a39' : 'rgba(255,255,255,0.35)'}} onClick={() => setIdx(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return d.toLocaleDateString();
}

function CommentItem({ comment, user, onReply, onLike }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onReply(comment.id, replyText);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div style={styles.comment}>
      <div style={styles.commentHeader}>
        <span style={styles.commentAuthor}>{comment.user?.name || 'Anonymous'}</span>
        <span style={styles.commentTime}>{formatTime(comment.created_at)}</span>
      </div>
      <p style={styles.commentBody}>{comment.body}</p>
      <div style={styles.commentActions}>
        <button style={styles.commentActionBtn} onClick={() => onLike(comment.id)}>
          {comment.is_liked_by_user ? '❤️' : '🤍'} {comment.likes_count || 0}
        </button>
        {user && (
          <button style={styles.commentActionBtn} onClick={() => setShowReply(!showReply)}>Reply</button>
        )}
      </div>
      {showReply && (
        <div style={styles.replyForm}>
          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." style={styles.replyInput} />
          <button onClick={handleReply} style={styles.replyBtn}>Send</button>
        </div>
      )}
      {comment.replies?.length > 0 && (
        <div style={styles.replies}>
          {comment.replies.map((reply) => (
            <div key={reply.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <span style={styles.commentAuthor}>{reply.user?.name || 'Anonymous'}</span>
                <span style={styles.commentTime}>{formatTime(reply.created_at)}</span>
              </div>
              <p style={styles.commentBody}>{reply.body}</p>
              <div style={styles.commentActions}>
                <button style={styles.commentActionBtn} onClick={() => onLike(reply.id)}>
                  {reply.is_liked_by_user ? '❤️' : '🤍'} {reply.likes_count || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentSection({ postId, user, onCommentCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(postId);
      setComments(res.data);
      onCommentCountChange?.(res.data.length);
    } catch {} finally {
      setLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleAdd = async () => {
    if (!body.trim()) return;
    try {
      const res = await addComment(postId, body);
      setComments((prev) => [res.data, ...prev]);
      setBody('');
      onCommentCountChange?.(comments.length + 1);
    } catch {}
  };

  return (
    <div>
      {user && (
        <div style={styles.commentForm}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a comment..." style={styles.commentInput} />
          <button onClick={handleAdd} style={styles.commentSubmit}>Post</button>
        </div>
      )}
      {loading ? (
        <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', padding: '10px' }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', padding: '10px' }}>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <CommentItem key={c.id} comment={c} user={user} onReply={handleReply} onLike={handleLike} />
        ))
      )}
    </div>
  );
}

export default function MyGallery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fullImg, setFullImg] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', business_location: user?.business_location || '', contact_phone: user?.phone || '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [likes, setLikes] = useState({});
  const [showLikesPopover, setShowLikesPopover] = useState(null);
  const [likesUsers, setLikesUsers] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    api.get('/gallery/my')
      .then((res) => {
        setPosts(res.data);
        const likeMap = {};
        res.data.forEach((p) => { likeMap[p.id] = { liked: p.is_liked_by_user, count: p.likes_count }; });
        setLikes(likeMap);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (files.length < 1) { setError('Please select at least 1 image'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('business_location', form.business_location);
      fd.append('contact_phone', form.contact_phone);
      files.forEach((f) => fd.append('images[]', f));

      const res = await api.post('/gallery', fd);
      setPosts([{ ...res.data, _commentCount: 0 }, ...posts]);
      setLikes((prev) => ({ ...prev, [res.data.id]: { liked: false, count: 0 } }));
      setForm({ title: '', description: '', business_location: user?.business_location || '', contact_phone: user?.phone || '' });
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try {
      await api.delete(`/gallery/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch { /* ignore */ }
  };

  const handleLike = async (postId) => {
    try {
      const res = await togglePostLike(postId);
      setLikes((prev) => ({ ...prev, [postId]: { liked: res.data.liked, count: res.data.likes_count } }));
    } catch {}
  };

  const updateCommentCount = (postId, count) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, _commentCount: count } : p));
  };

  const openLikes = async (postId) => {
    if (showLikesPopover === postId) {
      setShowLikesPopover(null);
      setLikesUsers(null);
      return;
    }
    try {
      const res = await getPostLikes(postId);
      setLikesUsers(res.data);
      setShowLikesPopover(postId);
    } catch {}
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <section style={styles.container}>
          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Gallery
          </motion.h1>

          <motion.form
            style={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 style={styles.formTitle}>Add New Post</h2>
            {error && <p style={styles.error}>{error}</p>}
            <input style={styles.input} placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            <textarea style={{...styles.input, minHeight: '80px', resize: 'vertical'}} placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
            <input style={styles.input} placeholder="Business Location" value={form.business_location} onChange={(e) => setForm({...form, business_location: e.target.value})} required />
            <PhoneInput value={form.contact_phone} onChange={(v) => setForm({...form, contact_phone: v})} style={{ marginBottom: '14px', width: '100%' }} required />
            <div style={styles.fileArea}>
              <label style={styles.fileLabel}>
                {files.length > 0 ? `${files.length} image(s) selected` : 'Choose Images (1-5)'}
                <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
              </label>
            </div>
            {previews.length > 0 && (
              <div style={styles.previews}>
                {previews.map((p, i) => (
                  <img key={i} src={p} style={styles.previewImg} alt="preview" />
                ))}
              </div>
            )}
            <button type="submit" style={{...styles.btn, opacity: submitting ? 0.6 : 1}} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post to Gallery'}
            </button>
          </motion.form>

          <div style={{ marginTop: '40px' }}>
            {loading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
            ) : posts.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center' }}>You haven't posted anything yet.</p>
            ) : (
              <div style={styles.grid}>
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    style={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                  >
                    <ImageCarousel images={post.images_url} title={post.title} onImageClick={setFullImg} />
                    <div style={styles.cardBody}>
                      <h3 style={styles.cardTitle}>{post.title}</h3>
                      <p style={styles.cardDesc}>{post.description}</p>
                      <div style={styles.meta}>
                        <p style={styles.cardMeta}>📍 {post.business_location}</p>
                        <p style={{...styles.cardMeta}}>📞 {post.contact_phone}</p>
                      </div>

                      <div style={styles.actionBar}>
                        <button style={styles.actionBtn} onClick={() => handleLike(post.id)}>
                          {likes[post.id]?.liked ? '❤️' : '🤍'} {likes[post.id]?.count || 0}
                        </button>
                        <span
                          style={{...styles.actionBtn, position: 'relative'}}
                          onClick={() => openLikes(post.id)}
                        >
                          👍 {likes[post.id]?.count || 0}
                          {showLikesPopover === post.id && likesUsers && (
                            <div style={styles.likesPopover}>
                              {likesUsers.length === 0 ? (
                                <span style={{ color: '#888', fontSize: '12px' }}>No likes yet</span>
                              ) : (
                                likesUsers.map((u) => (
                                  <div key={u.id} style={styles.likesPopoverItem}>
                                    {u.avatar_url ? (
                                      <img src={u.avatar_url} alt="" style={styles.likesPopoverAvatar} />
                                    ) : (
                                      <div style={styles.likesPopoverInitial}>{u.name?.charAt(0).toUpperCase()}</div>
                                    )}
                                    <span style={{ color: '#ccc', fontSize: '13px' }}>{u.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </span>
                        <button style={styles.actionBtn} onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
                          💬 {post._commentCount ?? post.comments_count ?? 0}
                        </button>
                      </div>

                      <AnimatePresence>
                        {expanded[post.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <CommentSection postId={post.id} user={user} onCommentCountChange={(c) => updateCommentCount(post.id, c)} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div style={styles.cardActions}>
                        <button onClick={() => handleDelete(post.id)} style={styles.deleteBtn}>Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {fullImg && (
          <motion.div
            style={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullImg(null)}
          >
            <motion.img
              src={fullImg}
              style={styles.lightboxImg}
              alt="full"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        )}
      </AnimatePresence>


      
      <ConfirmModal
        open={deleteConfirm !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        title="Delete this post?"
        message="This action cannot be undone. The post and all its comments will be permanently removed."
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: `url(${machineBg}) center/cover fixed no-repeat`,
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  overlay: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(10,10,10,0.92) 100%)',
    padding: 'clamp(40px, 6vw, 100px) clamp(16px, 4vw, 60px)',
  },
  container: { maxWidth: '1000px', margin: '0 auto' },
  title: { color: '#a37a39', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', textAlign: 'center', marginBottom: '32px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  form: {
    background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)',
    border: '1px solid #333',
    borderRadius: '16px',
    padding: 'clamp(20px, 3vw, 32px)',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  formTitle: { color: '#a37a39', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '700', marginBottom: '20px' },
  input: {
    width: '100%', padding: '12px 14px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #444',
    background: '#222', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  },
  fileArea: { marginBottom: '14px' },
  fileLabel: {
    display: 'block', padding: '12px', background: '#222', border: '1px dashed #555', borderRadius: '8px',
    color: '#a37a39', textAlign: 'center', cursor: 'pointer', fontSize: '14px',
  },
  previews: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' },
  previewImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' },
  btn: {
    width: '100%', background: 'linear-gradient(135deg, #a37a39, #d4af37)', color: '#fff', border: 'none',
    padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
  error: { color: '#ff6b6b', fontSize: '14px', marginBottom: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' },
  card: {
    background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)', border: '1px solid #333', borderRadius: '16px',
    overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  carousel: { position: 'relative', height: '220px', overflow: 'hidden', background: '#0d0d0d', borderBottom: '1px solid #222' },
  carouselImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },
  navBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', color: '#fff',
    border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '13px', cursor: 'pointer',
    zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
  },
  dots: { position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.2s' },
  cardBody: { padding: '16px' },
  cardTitle: { color: '#a37a39', fontSize: '16px', fontWeight: '700', marginBottom: '6px' },
  cardDesc: { color: '#aaa', fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' },
  meta: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #222', marginBottom: '10px' },
  cardMeta: { color: '#888', fontSize: '12px', margin: 0 },
  actionBar: { display: 'flex', gap: '16px', marginBottom: '10px', alignItems: 'center' },
  actionBtn: { background: 'transparent', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' },
  deleteBtn: {
    background: 'transparent', border: '1px solid #e57373', color: '#e57373', padding: '6px 16px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s',
  },
  cardActions: { display: 'flex', gap: '8px', marginTop: '10px' },

  commentForm: { display: 'flex', gap: '8px', marginBottom: '12px', padding: '0 0 12px', borderBottom: '1px solid #222' },
  commentInput: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', fontSize: '13px', outline: 'none' },
  commentSubmit: { padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#a37a39', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  comment: { padding: '10px 0', borderBottom: '1px solid #1a1a1a' },
  commentHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  commentAuthor: { color: '#a37a39', fontSize: '12px', fontWeight: 600 },
  commentTime: { color: '#666', fontSize: '10px' },
  commentBody: { color: '#ccc', fontSize: '13px', lineHeight: 1.5, margin: '0 0 6px' },
  commentActions: { display: 'flex', gap: '12px' },
  commentActionBtn: { background: 'transparent', border: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', padding: '2px 0' },
  replyForm: { display: 'flex', gap: '6px', margin: '8px 0 4px 16px' },
  replyInput: { flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff', fontSize: '12px', outline: 'none' },
  replyBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#a37a39', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  replies: { marginLeft: '16px', borderLeft: '1px solid #2a2a2a', paddingLeft: '12px' },
  likesPopover: {
    position: 'absolute', top: '100%', left: 0, background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '8px', padding: '8px', minWidth: '160px', maxHeight: '200px', overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 100,
  },
  likesPopoverItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' },
  likesPopoverAvatar: { width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' },
  likesPopoverInitial: { width: '24px', height: '24px', borderRadius: '50%', background: '#111', border: '1px solid #a37a39', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  lightbox: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  lightboxImg: { maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' },
};
