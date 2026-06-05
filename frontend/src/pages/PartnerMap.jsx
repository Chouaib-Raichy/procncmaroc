export default function PartnerMap() {
  return (
    <div className="page-section">
      <h1 className="section-title">Partner Map</h1>
      <p className="section-subtitle">Join our network of trusted distributors and resellers</p>

      <div style={styles.arSection}>
        <h2 style={styles.arTitle}>خريطة الشركاء</h2>
        <p style={styles.arText}>انضم إلى شبكتنا من الموزعين والموزعين المعتمدين في جميع أنحاء المغرب</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Why Partner With Us?</h3>
          <ul style={styles.list}>
            <li>Exclusive dealership in your region</li>
            <li>Competitive wholesale pricing</li>
            <li>Technical training and certification</li>
            <li>Marketing support and materials</li>
            <li>Priority technical support</li>
            <li>Access to new products first</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={styles.arCardTitle}>لماذا تتعاون معنا؟</h3>
          <ul style={styles.list}>
            <li>وكالة حصرية في منطقتك</li>
            <li>أسعار جملة تنافسية</li>
            <li>تدريب تقني وشهادة معتمدة</li>
            <li>دعم تسويقي ومواد دعائية</li>
            <li>دعم فني ذو أولوية</li>
            <li>الوصول إلى المنتجات الجديدة أولاً</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  arSection: {
    background: '#f8f9fa',
    padding: 'clamp(20px, 3vw, 30px)',
    borderRadius: '10px',
    marginBottom: 'clamp(24px, 4vw, 40px)',
    textAlign: 'right',
    direction: 'rtl',
  },
  arTitle: {
    fontSize: 'clamp(22px, 3.5vw, 32px)',
    color: '#a37a39',
    marginBottom: 'clamp(10px, 1.5vw, 15px)',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  arText: {
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#555',
    lineHeight: 1.8,
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  arCardTitle: {
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
  },
  list: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2.2',
    color: '#555',
    fontSize: 'clamp(14px, 1.5vw, 16px)',
  },
};
