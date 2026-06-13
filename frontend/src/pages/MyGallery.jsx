import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneInput from '../components/PhoneInput';
import ConfirmModal from '../components/ConfirmModal';
import { getComments, addComment, replyToComment, togglePostLike, toggleCommentLike, getPostLikes } from '../api/gallery';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';
import SEO from '../components/SEO';

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#e74c3c' : 'none'} stroke={filled ? '#e74c3c' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e57373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

function ImageCarousel({ images, title, onImageClick }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  return (
    <div style={styles.carousel}>
      <div style={styles.carouselGradientLeft} />
      <div style={styles.carouselGradientRight} />
      <span style={styles.carouselCounter}>{idx + 1} / {images.length}</span>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx]} alt={`${title} ${idx + 1}`} style={styles.carouselImg}
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }} onClick={() => onImageClick(images[idx])} />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button style={{ ...styles.navBtn, left: '8px' }} onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button style={{ ...styles.navBtn, right: '8px' }} onClick={() => setIdx((i) => (i + 1) % images.length)} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
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
        <div style={styles.commentAvatar}>{comment.user?.name?.charAt(0).toUpperCase() || 'A'}</div>
        <div>
          <span style={styles.commentAuthor}>{comment.user?.name || 'Anonymous'}</span>
          <span style={styles.commentTime}>{formatTime(comment.created_at)}</span>
        </div>
      </div>
      <p style={styles.commentBody}>{comment.body}</p>
      <div style={styles.commentActions}>
        <button style={styles.commentActionBtn} onClick={() => onLike(comment.id)}>
          <HeartIcon filled={comment.is_liked_by_user} /> {comment.likes_count || 0}
        </button>
        {user && (
          <button style={styles.commentActionBtn} onClick={() => setShowReply(!showReply)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
            Reply
          </button>
        )}
      </div>
      <AnimatePresence>
        {showReply && (
          <motion.div style={styles.replyForm} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." style={styles.replyInput} onKeyDown={(e) => e.key === 'Enter' && handleReply()} />
            <button onClick={handleReply} style={styles.replyBtn} disabled={!replyText.trim()}>Send</button>
          </motion.div>
        )}
      </AnimatePresence>
      {comment.replies?.length > 0 && (
        <div style={styles.replies}>
          {comment.replies.map((reply) => (
            <div key={reply.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <div style={styles.commentAvatar}>{reply.user?.name?.charAt(0).toUpperCase() || 'A'}</div>
                <div>
                  <span style={styles.commentAuthor}>{reply.user?.name || 'Anonymous'}</span>
                  <span style={styles.commentTime}>{formatTime(reply.created_at)}</span>
                </div>
              </div>
              <p style={styles.commentBody}>{reply.body}</p>
              <div style={styles.commentActions}>
                <button style={styles.commentActionBtn} onClick={() => onLike(reply.id)}>
                  <HeartIcon filled={reply.is_liked_by_user} /> {reply.likes_count || 0}
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

  const handleReply = async (commentId, text) => {
    try {
      const res = await replyToComment(commentId, text);
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, replies: [...(c.replies || []), res.data] } : c));
    } catch {}
  };

  const handleLike = async (commentId) => {
    try {
      const res = await toggleCommentLike(commentId);
      const { liked, likes_count } = res.data;
      setComments((prev) => prev.map((c) => {
        if (c.id === commentId) return { ...c, is_liked_by_user: liked, likes_count };
        if (c.replies?.some((r) => r.id === commentId)) return { ...c, replies: c.replies.map((r) => r.id === commentId ? { ...r, is_liked_by_user: liked, likes_count } : r) };
        return c;
      }));
    } catch {}
  };

  return (
    <div>
      {user && (
        <div style={styles.commentForm}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a comment..." style={styles.commentInput} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
          <motion.button onClick={handleAdd} style={styles.commentSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} disabled={!body.trim()}>Post</motion.button>
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
  const [descExpanded, setDescExpanded] = useState({});
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
    } catch {}
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
    <>
      <SEO title="My Gallery" description="Manage your photo gallery on PRO CNC MAROC — upload, organize, and share your CNC projects." canonicalUrl="/my-gallery" />
      <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <motion.div
            style={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={styles.title}>My Gallery</h1>
            <p style={styles.subtitle}>Manage your gallery posts — add new work, track engagement, and keep your portfolio fresh.</p>
            <div style={styles.titleDivider} />
          </motion.div>

          <div style={styles.layout}>
            <motion.div style={styles.formCard}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={styles.formHeader}>
                <ImageIcon />
                Add New Post
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <div style={styles.formRow}>
                  <div style={styles.formField}>
                    <label style={styles.fieldLabel}>Title</label>
                    <input style={styles.input} placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div style={styles.formField}>
                    <label style={styles.fieldLabel}>Business Location</label>
                    <input style={styles.input} placeholder="Google Maps link or address" value={form.business_location} onChange={(e) => setForm({ ...form, business_location: e.target.value })} required />
                  </div>
                </div>
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>Description</label>
                  <textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Describe your work..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>Contact Phone</label>
                  <PhoneInput value={form.contact_phone} onChange={(v) => setForm({ ...form, contact_phone: v })} style={{ width: '100%' }} />
                </div>
                <div style={styles.fileArea}>
                  <label style={styles.fileLabel}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
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
                <motion.button type="submit" style={{ ...styles.btn, opacity: submitting ? 0.6 : 1 }} disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  {submitting ? 'Posting...' : 'Post to Gallery'}
                </motion.button>
              </form>
            </motion.div>

            <div style={styles.postsSection}>
              {loading ? (
                <div style={styles.skeletonGrid}>
                  {[1, 2].map((n) => (
                    <div key={n} style={styles.skeletonCard}>
                      <div style={styles.skelImg} />
                      <div style={{ padding: '16px' }}>
                        <div style={{ ...styles.skelLine, width: '70%', height: '18px', marginBottom: '10px' }} />
                        <div style={{ ...styles.skelLine, width: '100%', height: '14px', marginBottom: '6px' }} />
                        <div style={{ ...styles.skelLine, width: '80%', height: '14px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <motion.div style={styles.emptyState}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p style={styles.emptyText}>You haven't posted anything yet.</p>
                  <p style={styles.emptySub}>Use the form to add your first gallery post.</p>
                </motion.div>
              ) : (
                <div style={styles.grid}>
                  {posts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      style={styles.card}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.06 * i }}
                      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', borderColor: 'rgba(163,122,57,0.3)' }}
                    >
                      <div style={styles.userBar}>
                        <div style={styles.userBarAvatar}>
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={styles.userBarName}>{user?.name}</div>
                          <div style={styles.userBarTime}>{formatTime(post.created_at)}</div>
                        </div>
                      </div>

                      <ImageCarousel images={post.images_url} title={post.title} onImageClick={setFullImg} />

                      <div style={styles.cardBody}>
                        <h3 style={styles.cardTitle}>{post.title}</h3>
                        <p style={{
                          ...styles.cardDesc,
                          WebkitLineClamp: descExpanded[post.id] ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          display: '-webkit-box',
                        }}>{post.description}</p>
                        {post.description && post.description.length > 100 && (
                          <motion.button
                            style={styles.viewMoreBtn}
                            onClick={() => setDescExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                            whileTap={{ scale: 0.95 }}
                          >
                            {descExpanded[post.id] ? 'Show less' : 'View more'}
                          </motion.button>
                        )}

                        <div style={styles.actionBar}>
                          <motion.button style={styles.actionBtn} onClick={() => handleLike(post.id)} whileTap={{ scale: 0.8 }}>
                            <HeartIcon filled={likes[post.id]?.liked} />
                            <span style={{ color: likes[post.id]?.liked ? '#e74c3c' : '#999' }}>{likes[post.id]?.count || 0}</span>
                          </motion.button>
                          <motion.button
                            style={{ ...styles.actionBtn, position: 'relative' }}
                            onClick={() => openLikes(post.id)}
                            whileTap={{ scale: 0.8 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                            </svg>
                            {likes[post.id]?.count || 0}
                            {showLikesPopover === post.id && likesUsers && (
                              <div style={styles.likesPopover}>
                                {likesUsers.length === 0 ? (
                                  <span style={{ color: '#888', fontSize: '12px' }}>No likes yet</span>
                                ) : (
                                  likesUsers.map((u) => (
                                    <motion.div
                                      key={u.id}
                                      style={styles.likesPopoverItem}
                                      onClick={() => { setShowLikesPopover(null); setLikesUsers(null); navigate(`/profile/${u.id}`); }}
                                      whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                                      whileTap={{ scale: 0.97 }}
                                    >
                                      {u.avatar_url ? (
                                        <img src={u.avatar_url} alt="" style={styles.likesPopoverAvatar} />
                                      ) : (
                                        <div style={styles.likesPopoverInitial}>{u.name?.charAt(0).toUpperCase()}</div>
                                      )}
                                      <span style={{ color: '#ccc', fontSize: '13px' }}>{u.name}</span>
                                    </motion.div>
                                  ))
                                )}
                              </div>
                            )}
                          </motion.button>
                          <motion.button style={styles.actionBtn} onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} whileTap={{ scale: 0.8 }}>
                            <CommentIcon />
                            <span>{post._commentCount ?? post.comments_count ?? 0}</span>
                          </motion.button>

                          <div style={{ marginLeft: 'auto' }}>
                            <motion.button style={styles.deleteBtn} onClick={() => handleDelete(post.id)} whileHover={{ background: 'rgba(229,115,115,0.1)' }} whileTap={{ scale: 0.9 }}>
                              <TrashIcon /> Delete
                            </motion.button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expanded[post.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={styles.commentDivider} />
                              <CommentSection postId={post.id} user={user} onCommentCountChange={(c) => updateCommentCount(post.id, c)} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fullImg && (
          <motion.div style={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullImg(null)}>
            <button style={styles.lightboxClose} onClick={() => setFullImg(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <motion.img src={fullImg} style={styles.lightboxImg} alt="full"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.25 }} />
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
    </>
  );
}

const styles = {
  page: { minHeight: '100vh', background: `url(${machineBg}) center/cover fixed no-repeat` },
  overlay: {
    minHeight: '100vh', background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(10,10,10,0.92) 100%)',
    padding: 'clamp(40px, 6vw, 100px) clamp(16px, 4vw, 60px)',
  },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 'clamp(32px, 4vw, 48px)' },
  title: { color: '#d4af37', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', margin: '0 0 8px' },
  subtitle: { color: '#888', fontSize: '14px', margin: '0 0 16px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' },
  titleDivider: { width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto' },

  layout: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 'clamp(20px, 3vw, 36px)', alignItems: 'start' },

  formCard: { background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '16px', padding: 'clamp(20px, 2.5vw, 28px)' },
  formHeader: { display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '15px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.3px' },
  formRow: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formField: { marginBottom: '0' },
  fieldLabel: { color: '#d4af37', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.3px' },
  input: {
    width: '100%', padding: '10px 13px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #2a2a2a',
    background: '#111', color: '#fff', fontSize: '13px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
  },
  fileArea: { marginBottom: '14px' },
  fileLabel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#111',
    border: '1px dashed #333', borderRadius: '8px', color: '#d4af37', textAlign: 'center', cursor: 'pointer', fontSize: '13px',
  },
  previews: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' },
  previewImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2a2a2a' },
  btn: {
    width: '100%', background: 'linear-gradient(135deg, #a37a39, #d4af37)', color: '#fff', border: 'none',
    padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  error: { color: '#ef9a9a', fontSize: '13px', marginBottom: '14px', padding: '8px 12px', background: '#2a0d0d', border: '1px solid #c62828', borderRadius: '8px' },

  postsSection: { minHeight: '300px' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
  skeletonCard: { background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' },
  skelImg: { width: '100%', height: '200px', background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },
  skelLine: { borderRadius: '4px', background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '16px' },
  emptyText: { color: '#888', fontSize: '16px', fontWeight: '600', marginTop: '16px' },
  emptySub: { color: '#666', fontSize: '13px', marginTop: '6px' },

  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
  card: {
    background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '16px',
    overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s',
  },

  userBar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #1a1a1a' },
  userBarAvatar: {
    width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #a37a39',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#d4af37', fontSize: '14px', fontWeight: 700, background: '#111', flexShrink: 0, overflow: 'hidden',
  },
  userBarName: { color: '#d4af37', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userBarTime: { color: '#666', fontSize: '11px', marginTop: '1px' },

  carousel: { position: 'relative', height: '240px', overflow: 'hidden', background: '#0d0d0d' },
  carouselGradientLeft: { position: 'absolute', top: 0, left: 0, width: '30px', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselGradientRight: { position: 'absolute', top: 0, right: 0, width: '30px', height: '100%', background: 'linear-gradient(270deg, rgba(0,0,0,0.25), transparent)', pointerEvents: 'none', zIndex: 1 },
  carouselCounter: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#d4af37', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '12px', zIndex: 2, letterSpacing: '0.3px' },
  carouselImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },
  navBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', color: '#fff',
    border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', zIndex: 2, transition: 'background 0.2s',
  },

  cardBody: { padding: '16px' },
  cardTitle: { color: '#d4af37', fontSize: '16px', fontWeight: '700', marginBottom: '6px' },
  cardDesc: { color: '#999', fontSize: '13px', lineHeight: 1.6, marginBottom: '4px' },
  viewMoreBtn: { background: 'transparent', border: 'none', color: '#4fc3f7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '0 0 8px', textDecoration: 'underline', textUnderlineOffset: '2px' },

  actionBar: { display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.04)' },
  actionBtn: { background: 'transparent', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 },
  deleteBtn: { background: 'transparent', border: '1px solid rgba(229,115,115,0.3)', color: '#e57373', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', transition: 'background 0.2s' },

  commentDivider: { height: '1px', background: 'linear-gradient(90deg, transparent, rgba(163,122,57,0.4), transparent)', margin: '10px 0 12px' },
  commentForm: { display: 'flex', gap: '8px', marginBottom: '12px', padding: '0 0 12px', borderBottom: '1px solid #1a1a1a' },
  commentInput: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '13px', outline: 'none' },
  commentSubmit: { padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #a37a39, #c8952e)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  comment: { padding: '10px 0', borderBottom: '1px solid #1a1a1a' },
  commentHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  commentAvatar: { width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #a37a39, #c8952e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  commentAuthor: { color: '#d4af37', fontSize: '12px', fontWeight: 600 },
  commentTime: { color: '#666', fontSize: '10px', marginLeft: '6px' },
  commentBody: { color: '#ccc', fontSize: '13px', lineHeight: 1.5, margin: '0 0 6px', paddingLeft: '34px' },
  commentActions: { display: 'flex', gap: '14px', paddingLeft: '34px' },
  commentActionBtn: { background: 'transparent', border: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' },
  replyForm: { display: 'flex', gap: '6px', margin: '8px 0 4px 34px', overflow: 'hidden' },
  replyInput: { flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '12px', outline: 'none' },
  replyBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #a37a39, #c8952e)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  replies: { marginLeft: '34px', borderLeft: '1px solid #2a2a2a', paddingLeft: '12px', marginTop: '4px' },

  likesPopover: {
    position: 'absolute', top: '100%', left: 0, background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '8px', padding: '8px', minWidth: '160px', maxHeight: '200px', overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 100,
  },
  likesPopoverItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' },
  likesPopoverAvatar: { width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' },
  likesPopoverInitial: { width: '24px', height: '24px', borderRadius: '50%', background: '#111', border: '1px solid #a37a39', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '11px', fontWeight: 700, flexShrink: 0 },
  lightbox: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  lightboxClose: { position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  lightboxImg: { maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' },
};
