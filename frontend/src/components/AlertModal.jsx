import { motion, AnimatePresence } from 'framer-motion';

const gold = '#a37a39';

const backdrop = {
  position: 'fixed', inset: 0, zIndex: 10000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
};

const modal = {
  background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
  border: `1px solid ${gold}`,
  borderRadius: '16px',
  padding: 'clamp(28px, 4vw, 44px)',
  maxWidth: '420px',
  width: '90%',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `0 0 30px ${gold}33, 0 0 60px ${gold}1a`,
};

const iconWrap = {
  width: '64px', height: '64px', borderRadius: '50%',
  border: `2px solid ${gold}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  margin: '0 auto 18px',
  background: `${gold}11`,
};

const title = {
  color: '#fff', fontSize: 'clamp(18px, 2.2vw, 22px)',
  fontWeight: 700, marginBottom: '8px',
};

const subtitle = {
  color: '#999', fontSize: 'clamp(13px, 1.1vw, 15px)',
  marginBottom: '28px', lineHeight: 1.5,
};

const okBtn = {
  width: '100%', padding: 'clamp(10px, 1.2vw, 14px)',
  borderRadius: '10px', border: 'none',
  background: `linear-gradient(135deg, ${gold}, #c8952e)`,
  color: '#000', fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 700,
  cursor: 'pointer', transition: 'all 0.2s',
};

export default function AlertModal({ open, title: msgTitle, message, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div style={backdrop}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div style={modal}
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: `radial-gradient(circle, ${gold}22 0%, transparent 70%)`,
            }} />

            <div style={iconWrap}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3 style={title}>{msgTitle || 'Notice'}</h3>
            <p style={subtitle}>{message}</p>

            <button style={okBtn}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
              onClick={onClose}
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
