import machineBg from '../assets/machineBG.jpeg';
import about from '../assets/about.jpg';
import premiumIcon from '../assets/premium-icon.svg';

export default function AboutUs() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <section style={styles.container}>
          <div style={styles.imageContainer}>
            <img src={about} alt="About" style={styles.image} />
          </div>

          <div style={styles.content}>
            <h1 style={styles.title}>
              We Are Expert In All
              CNC Machines
            </h1>

            <p style={styles.description}>
              PRO CNC MAROC is the leading Moroccan company in digital engraving
              and laser cutting technology, distinguished by its unwavering
              commitment to its partners.
            </p>

            <p style={styles.description}>
              We are the only providers of free professional training and lifetime
              free technical support, we also specialize in providing original,
              certified, high-quality machines, carefully selected to ensure high
              performance and durability.
            </p>

            <p style={styles.description}>
              Because our clients are not just customers, they are our lifelong
              partners, we don't just sell a service; we are committed to
              continuously supporting you to ensure your success.
            </p>

            <div style={styles.stats}>
              <div style={styles.statItem}>
                <h2 style={styles.number}>144</h2>
                <p style={styles.label}>Online visitors</p>
              </div>

              <div style={styles.statItem}>
                <h2 style={styles.number}>39</h2>
                <p style={styles.label}>Orders in progress</p>
              </div>

              <div style={styles.statItem}>
                <h2 style={styles.number}>3</h2>
                <p style={styles.label}>Completed today</p>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.icon}>
                <img src={premiumIcon} alt="Premium" style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>

              <div>
                <h3 style={styles.featureTitle}>Premium Machinery</h3>

                <p style={styles.featureText}>
                  Our machinery is fully certified to meet the highest global
                  standards for safety, precision, and heavy-duty industrial
                  performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: '100vh',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
    minHeight: "100vh",
    padding: "60px",
    flexWrap: "wrap",
    maxWidth: '1200px',
    margin: '0 auto',
  },

  imageContainer: {
    flex: 1,
    minWidth: "400px",
    maxWidth: "1200px",
    border: "3px solid #a37a39",
    borderRadius: "8px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  content: {
    flex: 1,
    minWidth: "350px",
    color: "#fff",
  },

  title: {
    fontSize: "clamp(26px,3vw,27px)",
    fontWeight: "800",
    color: "#c7984e",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  description: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#ffffff",
    marginBottom: "18px",
  },

  stats: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
    marginBottom: "30px",
    gap: "clamp(24px, 5vw, 60px)",
    flexWrap: "wrap",
  },

  statItem: {
    textAlign: "center",
  },

  number: {
    fontSize: "36px",
    color: "#c7984e",
    fontWeight: "700",
    margin: 0,
  },

  label: {
    color: "#888",
    fontSize: "14px",
    marginTop: "8px",
  },

  feature: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },

  icon: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    background: "radial-gradient(circle at 40% 35%, #1a1a1a, #000)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px",
  },

  featureTitle: {
    color: "#c7984e",
    fontSize: "22px",
    marginBottom: "8px",
  },

  featureText: {
    color: "#999",
    fontSize: "14px",
    lineHeight: "1.6",
  },
};