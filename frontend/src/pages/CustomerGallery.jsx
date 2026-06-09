import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getComments, addComment, replyToComment, togglePostLike, toggleCommentLike } from '../api/gallery';
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

  const handleReply = async (commentId, text) => {
    try {
      const res = await replyToComment(commentId, text);
      setComments((prev) => prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...(c.replies || []), res.data] } : c
      ));
    } catch {}
  };

  const handleLike = async (commentId) => {
    try {
      const res = await toggleCommentLike(commentId);
      setComments((prev) => prev.map((c) => {
        if (c.id === commentId) return { ...c, is_liked_by_user: res.data.liked, likes_count: res.data.likes_count };
        if (c.replies) {
          return { ...c, replies: c.replies.map((r) => r.id === commentId ? { ...r, is_liked_by_user: res.data.liked, likes_count: res.data.likes_count } : r) };
        }
        return c;
      }));
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

export default function CustomerGallery() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullImg, setFullImg] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [likes, setLikes] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = (p) => {
    setLoading(true);
    setError(null);
    api.get(`/gallery?page=${p}&per_page=9`)
      .then((res) => {
        setPosts(res.data.data);
        setTotalPages(res.data.last_page);
        const likeMap = {};
        res.data.data.forEach((p) => { likeMap[p.id] = { liked: p.is_liked_by_user, count: p.likes_count }; });
        setLikes(likeMap);
      })
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(page); }, [page]);

  const handleLike = async (postId) => {
    try {
      const res = await togglePostLike(postId);
      setLikes((prev) => ({ ...prev, [postId]: { liked: res.data.liked, count: res.data.likes_count } }));
    } catch {}
  };

  const updateCommentCount = (postId, count) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, _commentCount: count } : p));
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <section style={styles.container}>
          <motion.h1 style={styles.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Customer Gallery</motion.h1>
          <motion.p style={styles.subtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            See what our customers have achieved with PRO CNC MAROC machines
          </motion.p>

          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <div style={styles.loadingSpinner} />
              <p style={{ color: '#aaa', textAlign: 'center', marginTop: '16px' }}>Loading gallery...</p>
            </motion.div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#ff6b6b', fontSize: '16px', marginBottom: '16px' }}>{error}</p>
              <button onClick={() => fetch(page)} style={styles.retryBtn}>Try Again</button>
            </div>
          ) : posts.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', fontSize: '16px' }}>No posts yet. Be the first to share!</p>
          ) : (
            <div style={styles.grid}>
              {posts.map((post, i) => (
                <motion.div key={post.id} style={styles.card}
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * i }} whileHover={{ y: -4, borderColor: '#a37a39' }}
                >
                  <div style={styles.userBar}>
                    {post.user?.avatar_url ? (
                      <img src={post.user.avatar_url} alt="" style={styles.userBarAvatar} />
                    ) : (
                      <div style={styles.userBarInitial}>{post.user?.name?.charAt(0).toUpperCase()}</div>
                    )}
                    <span style={styles.userBarName}>{post.user?.name}</span>
                    <span style={styles.userBarTime}>{formatTime(post.created_at)}</span>
                  </div>

                  <ImageCarousel images={post.images_url} title={post.title} onImageClick={(url) => setFullImg(url)} />

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{post.title}</h3>
                    <p style={styles.cardDesc}>{post.description}</p>

                    <div style={styles.meta}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.business_location || '')}`} target="_blank" rel="noopener noreferrer" style={styles.mapLink}>
                        📍 {post.business_location}
                      </a>
                      <a
                        href={`https://wa.me/${post.contact_phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.phoneLink}
                        title="Open WhatsApp"
                      >
                        📞 {post.contact_phone}
                      </a>
                      {post.user?.email && (
                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(post.user.email)}`} target="_blank" rel="noopener noreferrer" style={styles.emailLink} title="Send email via Gmail">
                          ✉️ {post.user.email}
                        </a>
                      )}
                    </div>

                    <div style={styles.actionBar}>
                      <button style={styles.actionBtn} onClick={() => handleLike(post.id)}>
                        {likes[post.id]?.liked ? '❤️' : '🤍'} {likes[post.id]?.count || 0}
                      </button>
                      <button style={styles.actionBtn} onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
                        💬 {post._commentCount ?? post.comments_count ?? 0}
                      </button>
                    </div>

                    <AnimatePresence>
                      {expanded[post.id] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <CommentSection postId={post.id} user={user} onCommentCountChange={(c) => updateCommentCount(post.id, c)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <motion.div style={styles.pagination}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                style={{...styles.pageBtn, opacity: page <= 1 ? 0.4 : 1}}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                &#10094; Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  style={{...styles.pageNum, background: p === page ? '#a37a39' : 'transparent', color: p === page ? '#fff' : '#aaa'}}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                style={{...styles.pageBtn, opacity: page >= totalPages ? 0.4 : 1}}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next &#10095;
              </button>
            </motion.div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {fullImg && (
          <motion.div style={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullImg(null)}>
            <motion.img src={fullImg} style={styles.lightboxImg} alt="full" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} transition={{ duration: 0.25 }} />
          </motion.div>
        )}
      </AnimatePresence>
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
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#a37a39', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', textAlign: 'center', marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  subtitle: { color: '#ccc', fontSize: 'clamp(14px, 2vw, 18px)', textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 60px)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'clamp(20px, 2.5vw, 32px)' },
  card: { background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)', border: '1px solid #333', borderRadius: '16px', overflow: 'hidden', cursor: 'default', transition: 'border-color 0.3s, transform 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
  carousel: { position: 'relative', height: '260px', overflow: 'hidden', background: '#0d0d0d', borderBottom: '1px solid #222' },
  carouselImg: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },
  navBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: '50%', width: '34px', height: '34px', fontSize: '15px', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  dots: { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.2s' },
  cardBody: { padding: 'clamp(14px, 2vw, 20px)' },
  cardTitle: { color: '#a37a39', fontSize: 'clamp(16px, 1.5vw, 19px)', fontWeight: '700', marginBottom: '8px' },
  cardDesc: { color: '#aaa', fontSize: 'clamp(13px, 1.2vw, 14px)', lineHeight: 1.7, marginBottom: '14px' },
  meta: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #222', marginBottom: '12px' },
  mapLink: { color: '#4fc3f7', fontSize: '12px', textDecoration: 'none' },
  phoneLink: { color: '#4fc3f7', fontSize: '12px', textDecoration: 'none' },
  actionBar: { display: 'flex', gap: '16px', marginBottom: '8px' },
  actionBtn: { background: 'transparent', border: 'none', color: '#aaa', fontSize: '14px', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' },
  userBar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid #222' },
  userBarAvatar: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a37a39', flexShrink: 0 },
  userBarInitial: { width: '32px', height: '32px', borderRadius: '50%', background: '#111', border: '2px solid #a37a39', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a37a39', fontSize: '14px', fontWeight: 700, flexShrink: 0 },
  userBarName: { color: '#a37a39', fontSize: '13px', fontWeight: 600, lineHeight: 1.3 },
  userBarTime: { color: '#666', fontSize: '11px', flexShrink: 0 },
  emailLink: { color: '#4fc3f7', fontSize: '12px', textDecoration: 'none' },
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
  lightbox: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  lightboxImg: { maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' },
  loadingSpinner: {
    width: '40px', height: '40px', border: '3px solid #333', borderTopColor: '#a37a39',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '40px auto 0',
  },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' },
  pageBtn: {
    background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '8px 16px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s',
  },
  pageNum: {
    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #444',
    cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s',
  },
  retryBtn: {
    background: '#a37a39', color: '#fff', border: 'none', padding: '10px 28px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
  },
};
