import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getComments, addComment, replyToComment, togglePostLike, toggleCommentLike } from '../api/gallery';
import api from '../api/axios';
import machineBg from '../assets/machineBG.jpeg';

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#e74c3c' : 'none'} stroke={filled ? '#e74c3c' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ReplyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function ImageCarousel({ images, title, onImageClick }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  return (
    <div style={styles.carousel}>
      <AnimatePresence mode="wait">
        <motion.img
          key={idx} src={images[idx]} alt={`${title} ${idx + 1}`}
          style={styles.carouselImg}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={() => onImageClick(images[idx])}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <div style={styles.carouselGradientLeft} />
          <div style={styles.carouselGradientRight} />
          <button style={{ ...styles.navBtn, left: '8px' }} onClick={prev} aria-label="Previous">&#10094;</button>
          <button style={{ ...styles.navBtn, right: '8px' }} onClick={next} aria-label="Next">&#10095;</button>
          <div style={styles.carouselCounter}>{idx + 1} / {images.length}</div>
          <div style={styles.dots}>
            {images.map((_, i) => (
              <span key={i} style={{ ...styles.dot, background: i === idx ? '#d4af37' : 'rgba(255,255,255,0.25)', width: i === idx ? '20px' : '8px' }} onClick={() => setIdx(i)} />
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.comment}
    >
      <div style={styles.commentHeader}>
        <div style={styles.commentAvatar}>
          {comment.user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div>
          <span style={styles.commentAuthor}>{comment.user?.name || 'Anonymous'}</span>
          <span style={styles.commentTime}>{formatTime(comment.created_at)}</span>
        </div>
      </div>
      <p style={styles.commentBody}>{comment.body}</p>
      <div style={styles.commentActions}>
        <motion.button
          style={styles.commentActionBtn}
          onClick={() => onLike(comment.id)}
          whileTap={{ scale: 0.85 }}
        >
          <HeartIcon filled={comment.is_liked_by_user} />
          <span style={{ color: comment.is_liked_by_user ? '#e74c3c' : '#888' }}>{comment.likes_count || 0}</span>
        </motion.button>
        {user && (
          <motion.button
            style={styles.commentActionBtn}
            onClick={() => setShowReply(!showReply)}
            whileTap={{ scale: 0.85 }}
          >
            <ReplyIcon />
            <span>Reply</span>
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={styles.replyForm}
          >
            <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." style={styles.replyInput} />
            <motion.button onClick={handleReply} style={styles.replyBtn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {comment.replies?.length > 0 && (
        <div style={styles.replies}>
          {comment.replies.map((reply) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.comment}
            >
              <div style={styles.commentHeader}>
                <div style={{ ...styles.commentAvatar, width: '24px', height: '24px', fontSize: '10px' }}>
                  {reply.user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <span style={styles.commentAuthor}>{reply.user?.name || 'Anonymous'}</span>
                  <span style={styles.commentTime}>{formatTime(reply.created_at)}</span>
                </div>
              </div>
              <p style={styles.commentBody}>{reply.body}</p>
              <div style={styles.commentActions}>
                <motion.button style={styles.commentActionBtn} onClick={() => onLike(reply.id)} whileTap={{ scale: 0.85 }}>
                  <HeartIcon filled={reply.is_liked_by_user} />
                  <span style={{ color: reply.is_liked_by_user ? '#e74c3c' : '#888' }}>{reply.likes_count || 0}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
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
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a comment..." style={styles.commentInput}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <motion.button
            onClick={handleAdd}
            style={styles.commentSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!body.trim()}
          >
            Post
          </motion.button>
        </div>
      )}
      {loading ? (
        <div style={{ padding: '12px 0' }}>
          {[1,2].map((i) => (
            <div key={i} style={{ display:'flex', gap:'10px', marginBottom:'12px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#222', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ height:'10px', width:'80px', background:'#222', borderRadius:'4px', marginBottom:'6px' }} />
                <div style={{ height:'10px', width:'140px', background:'#222', borderRadius:'4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', padding: '16px 0' }}>No comments yet. Start the conversation.</p>
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
  const [descExpanded, setDescExpanded] = useState({});
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 60px)' }}
          >
            <h1 style={styles.title}>Customer Gallery</h1>
            <div style={styles.titleDivider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerDiamond}>✦</span>
              <span style={styles.dividerLine} />
            </div>
            <p style={styles.subtitle}>See what our customers have achieved with PRO CNC MAROC machines</p>
          </motion.div>

          {loading ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div key={i} variants={cardVariants} style={styles.skeletonCard}>
                  <div style={{ height: '200px', background: '#1a1a1a', borderRadius: '12px 12px 0 0' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#222' }} />
                      <div style={{ height:'12px', width:'100px', background:'#222', borderRadius:'4px' }} />
                    </div>
                    <div style={{ height:'14px', background:'#222', borderRadius:'4px', marginBottom:'8px' }} />
                    <div style={{ height:'14px', width:'60%', background:'#222', borderRadius:'4px' }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ color: '#ff6b6b', fontSize: '16px', marginBottom: '16px' }}>{error}</p>
              <motion.button onClick={() => fetch(page)} style={styles.retryBtn} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Try Again</motion.button>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginBottom: '20px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <p style={{ color: '#888', fontSize: '16px' }}>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.grid}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(163,122,57,0.4)' }}
                  style={styles.card}
                  layout
                >
                  <div style={styles.userBar}>
                    {post.user?.avatar_url ? (
                      <img src={post.user.avatar_url} alt="" style={styles.userBarAvatar} />
                    ) : (
                      <div style={styles.userBarInitial}>{post.user?.name?.charAt(0).toUpperCase()}</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.userBarName}>{post.user?.name}</div>
                      <div style={styles.userBarTime}>{formatTime(post.created_at)}</div>
                    </div>
                  </div>

                  <ImageCarousel images={post.images_url} title={post.title} onImageClick={(url) => setFullImg(url)} />

                  <div style={styles.cardBody}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>{post.title}</h3>
                      {post.business_location && (
                        <motion.a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.business_location)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={styles.gmapsBtn} title="View on Google Maps"
                          whileHover={{ background: 'rgba(79,195,247,0.18)', borderColor: 'rgba(79,195,247,0.5)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MapPinIcon />
                        </motion.a>
                      )}
                    </div>
                    <div style={styles.descWrap}>
                      <p style={{
                        ...styles.cardDesc,
                        WebkitLineClamp: descExpanded[post.id] ? 'unset' : 6,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        display: '-webkit-box',
                      }}>{post.description}</p>
                      {post.description && post.description.length > 120 && (
                        <motion.button
                          style={styles.viewMoreBtn}
                          onClick={() => setDescExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          whileTap={{ scale: 0.95 }}
                        >
                          {descExpanded[post.id] ? 'Show less' : 'View more'}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div style={styles.actionBar}>
                    <motion.button
                      style={{
                        ...styles.actionBtn,
                        color: likes[post.id]?.liked ? '#e74c3c' : '#ccc',
                      }}
                      onClick={() => handleLike(post.id)}
                      whileHover={{ background: 'rgba(231,76,60,0.08)' }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <HeartIcon filled={likes[post.id]?.liked} />
                      <span>{likes[post.id]?.count || 0}</span>
                    </motion.button>
                    <motion.button
                      style={styles.actionBtn}
                      onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      whileHover={{ background: 'rgba(255,255,255,0.06)' }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <CommentIcon />
                      <span>{post._commentCount ?? post.comments_count ?? 0}</span>
                    </motion.button>
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
                  </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={styles.pagination}
            >
              <motion.button
                style={{ ...styles.pageBtn, opacity: page <= 1 ? 0.4 : 1 }}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                whileHover={page > 1 ? { scale: 1.05 } : {}}
                whileTap={page > 1 ? { scale: 0.95 } : {}}
              >
                &#10094; Prev
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <motion.button
                  key={p}
                  style={{ ...styles.pageNum, background: p === page ? 'rgba(163,122,57,0.25)' : 'transparent', borderColor: p === page ? '#a37a39' : '#333', color: p === page ? '#d4af37' : '#888' }}
                  onClick={() => setPage(p)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {p}
                </motion.button>
              ))}
              <motion.button
                style={{ ...styles.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                whileHover={page < totalPages ? { scale: 1.05 } : {}}
                whileTap={page < totalPages ? { scale: 0.95 } : {}}
              >
                Next &#10095;
              </motion.button>
            </motion.div>
          )}
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
            <motion.button
              style={styles.lightboxClose}
              onClick={() => setFullImg(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </motion.button>
            <motion.img
              src={fullImg} style={styles.lightboxImg} alt=""
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  overlay: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(10,10,10,0.92) 100%)',
    padding: 'clamp(40px, 6vw, 100px) clamp(16px, 4vw, 60px)',
  },
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: {
    color: '#d4af37', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
    margin: 0, letterSpacing: '1px', textTransform: 'uppercase',
  },
  titleDivider: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '12px', margin: '14px auto 16px', maxWidth: '300px',
  },
  dividerLine: {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, transparent, #a37a39, transparent)',
  },
  dividerDiamond: { color: '#d4af37', fontSize: '14px' },
  subtitle: {
    color: '#bbb', fontSize: 'clamp(14px, 2vw, 17px)', textAlign: 'center',
    maxWidth: '600px', margin: '0 auto', lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: 'clamp(20px, 2.5vw, 32px)',
  },
  skeletonCard: {
    background: 'linear-gradient(145deg, #0d0d0d, #161616)',
    border: '1px solid #222', borderRadius: '12px', overflow: 'hidden',
  },
  card: {
    background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)',
    border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden',
    cursor: 'default', transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  carousel: {
    position: 'relative', height: '260px', overflow: 'hidden',
    background: '#0d0d0d',
  },
  carouselImg: {
    width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer',
  },
  carouselGradientLeft: {
    position: 'absolute', top: 0, left: 0, width: '40px', height: '100%',
    background: 'linear-gradient(90deg, rgba(0,0,0,0.3), transparent)',
    pointerEvents: 'none', zIndex: 1,
  },
  carouselGradientRight: {
    position: 'absolute', top: 0, right: 0, width: '40px', height: '100%',
    background: 'linear-gradient(270deg, rgba(0,0,0,0.3), transparent)',
    pointerEvents: 'none', zIndex: 1,
  },
  navBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
    borderRadius: '50%', width: '34px', height: '34px', fontSize: '15px',
    cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'background 0.2s',
  },
  carouselCounter: {
    position: 'absolute', top: '10px', right: '10px',
    background: 'rgba(0,0,0,0.6)', color: '#d4af37', fontSize: '11px',
    fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
    zIndex: 2, letterSpacing: '0.5px',
  },
  dots: {
    position: 'absolute', bottom: '10px', left: '50%',
    transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 2,
  },
  dot: {
    height: '8px', borderRadius: '4px', cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cardBody: { padding: 'clamp(14px, 2vw, 20px)' },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '10px', marginBottom: '8px',
  },
  cardTitle: {
    color: '#d4af37', fontSize: 'clamp(16px, 1.5vw, 18px)',
    fontWeight: 700, flex: 1, minWidth: 0,
  },
  gmapsBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
    background: 'rgba(79,195,247,0.08)',
    border: '1px solid rgba(79,195,247,0.25)',
    transition: 'all 0.2s', marginTop: '2px',
    textDecoration: 'none',
  },
  descWrap: { marginBottom: '16px' },
  viewMoreBtn: {
    background: 'transparent', border: 'none',
    color: '#4fc3f7', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    padding: '4px 0 0', textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  cardDesc: {
    color: '#999', fontSize: 'clamp(13px, 1.2vw, 14px)',
    lineHeight: 1.7,
  },
  actionBar: {
    display: 'flex', gap: '6px', padding: '10px 14px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  actionBtn: {
    background: 'transparent', border: 'none', color: '#ccc',
    fontSize: '13px', cursor: 'pointer', padding: '6px 14px 6px 10px',
    display: 'flex', alignItems: 'center', gap: '7px',
    fontWeight: 500, borderRadius: '8px',
    transition: 'background 0.15s',
  },
  userBar: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
    borderBottom: '1px solid #222',
  },
  userBarAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    objectFit: 'cover', border: '2px solid #a37a39', flexShrink: 0,
  },
  userBarInitial: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#111', border: '2px solid #a37a39',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#d4af37', fontSize: '15px', fontWeight: 700, flexShrink: 0,
  },
  userBarName: {
    color: '#d4af37', fontSize: '13px', fontWeight: 600,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  userBarTime: {
    color: '#666', fontSize: '11px', marginTop: '1px',
  },
  commentDivider: {
    height: '1px', background: 'linear-gradient(90deg, transparent, #a37a39, transparent)',
    margin: '10px 0 12px',
  },
  commentForm: {
    display: 'flex', gap: '8px', marginBottom: '12px', padding: '0 0 12px',
    borderBottom: '1px solid #222',
  },
  commentInput: {
    flex: 1, padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #444', background: '#222', color: '#fff',
    fontSize: '13px', outline: 'none',
  },
  commentSubmit: {
    padding: '8px 18px', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  },
  comment: { padding: '10px 0', borderBottom: '1px solid #1a1a1a' },
  commentHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  commentAvatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#000', fontSize: '11px', fontWeight: 700, flexShrink: 0,
  },
  commentAuthor: { color: '#d4af37', fontSize: '12px', fontWeight: 600 },
  commentTime: { color: '#666', fontSize: '10px', marginLeft: '6px' },
  commentBody: {
    color: '#ccc', fontSize: '13px', lineHeight: 1.5,
    margin: '0 0 6px', paddingLeft: '36px',
  },
  commentActions: {
    display: 'flex', gap: '14px', paddingLeft: '36px',
  },
  commentActionBtn: {
    background: 'transparent', border: 'none',
    color: '#888', fontSize: '12px', cursor: 'pointer',
    padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px',
  },
  replyForm: {
    display: 'flex', gap: '6px', margin: '8px 0 4px 36px', overflow: 'hidden',
  },
  replyInput: {
    flex: 1, padding: '6px 10px', borderRadius: '6px',
    border: '1px solid #444', background: '#222', color: '#fff',
    fontSize: '12px', outline: 'none',
  },
  replyBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
  },
  replies: {
    marginLeft: '36px', borderLeft: '1px solid #2a2a2a',
    paddingLeft: '12px', marginTop: '4px',
  },
  lightbox: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.92)', zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  lightboxClose: {
    position: 'absolute', top: '20px', right: '20px',
    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
    width: '40px', height: '40px', cursor: 'pointer', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  lightboxImg: { maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '8px', marginTop: '40px', flexWrap: 'wrap',
  },
  pageBtn: {
    background: 'transparent', border: '1px solid #555', color: '#ccc',
    padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 600, transition: 'opacity 0.2s',
  },
  pageNum: {
    width: '38px', height: '38px', borderRadius: '8px',
    border: '1px solid #333', cursor: 'pointer', fontSize: '14px',
    fontWeight: 600, transition: 'background 0.2s, border-color 0.2s',
  },
  retryBtn: {
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    color: '#fff', border: 'none', padding: '10px 28px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
  },
};
