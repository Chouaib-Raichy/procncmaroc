import SEO from '../components/SEO';

export default function Products() {
  const categories = [
    {
      name: 'Consumables',
      items: ['Laser tubes (CO2 & Fiber)', 'Lenses & Mirrors', 'Nozzles & Tips', 'Focusing lenses'],
    },
    {
      name: 'Spare Parts',
      items: ['Power supplies', 'Controllers (Ruida, LightBurn)', 'Motors & Drivers', 'Water chillers'],
    },
    {
      name: 'Accessories',
      items: ['Rotary attachments', 'Air assist systems', 'Exhaust fans', 'Honeycomb tables'],
    },
    {
      name: 'Software',
      items: ['LightBurn license', 'RDWorks', 'LaserGRBL', 'CAD/CAM software'],
    },
  ];

  return (
    <div className="page-section">
      <SEO title="Products" description="Explore all our CNC products and services in Morocco: precision machining, laser cutting, engraving, and 3D printing." canonicalUrl="/products" />
      <h1 className="section-title">Products</h1>
      <p className="section-subtitle">Everything you need for your CNC and laser operations</p>
      <div className="card-grid">
        {categories.map((cat, i) => (
          <div key={i} className="card">
            <h2 style={styles.catName}>{cat.name}</h2>
            <ul style={styles.list}>
              {cat.items.map((item, j) => (
                <li key={j} style={styles.item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  catName: {
    fontSize: 'clamp(20px, 2.5vw, 24px)',
    color: '#e94560',
    marginBottom: 'clamp(12px, 2vw, 20px)',
    borderBottom: '2px solid #e94560',
    paddingBottom: 'clamp(6px, 1vw, 10px)',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    padding: 'clamp(6px, 1vw, 8px) 0',
    color: '#555',
    borderBottom: '1px solid #eee',
    fontSize: 'clamp(13px, 1.5vw, 15px)',
  },
};
