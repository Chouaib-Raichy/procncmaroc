export default function LazyVideo({ style }) {
  return (
    <div style={{ ...style, overflow: 'hidden', background: '#0d0d0d' }}>
      <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(163,122,57,0.06) 0%, #0d0d0d 70%)' }} />
    </div>
  );
}
