import { useState, useEffect, useRef } from 'react';

export default function LazyVideo({ src, style, ...props }) {
  const [load, setLoad] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
          idle(() => setLoad(true), { timeout: 5000 });
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => { observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} style={{ ...style, overflow: 'hidden', background: '#0d0d0d' }}>
      {load ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          {...props}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(163,122,57,0.06) 0%, #0d0d0d 70%)' }} />
      )}
    </div>
  );
}
