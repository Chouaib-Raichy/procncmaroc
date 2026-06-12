import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import machineBg from '../assets/machineBG.jpeg';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using ProCNC Maroc\'s website, products, or services, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you must not use our platform or services.',
  },
  {
    title: '2. Description of Services',
    content: 'ProCNC Maroc provides CNC machining solutions, including but not limited to laser marking, fiber engraving, and industrial fabrication services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.',
  },
  {
    title: '3. User Registration & Account',
    content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration and promptly update it as needed.',
  },
  {
    title: '4. Use License',
    content: 'ProCNC Maroc grants you a limited, non-exclusive, non-transferable license to access and use our platform for personal or business purposes. This license does not permit: (a) modification or reverse engineering of any materials; (b) commercial reproduction without written consent; (c) use of automated tools or bots; (d) any unlawful or fraudulent activity.',
  },
  {
    title: '5. User Content & Gallery',
    content: 'By submitting content to our gallery or platform, you grant ProCNC Maroc a worldwide, royalty-free license to display, reproduce, and distribute your content for promotional and operational purposes. You warrant that you own or have the necessary rights to all submitted content.',
  },
  {
    title: '6. Intellectual Property',
    content: 'All materials, trademarks, logos, and content displayed on the ProCNC Maroc platform are the intellectual property of ProCNC Maroc or its licensors. Unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'ProCNC Maroc shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.',
  },
  {
    title: '8. Privacy Policy',
    content: 'Your use of our platform is also governed by our Privacy Policy. We collect, store, and process personal data in accordance with applicable data protection laws. By using our services, you consent to such processing and warrant that all data provided is accurate.',
  },
  {
    title: '9. Third-Party Links',
    content: 'Our platform may contain links to third-party websites or services that are not owned or controlled by ProCNC Maroc. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.',
  },
  {
    title: '10. Termination',
    content: 'We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice, for any breach of these Terms of Use. Upon termination, your right to use the platform will cease immediately.',
  },
  {
    title: '11. Governing Law',
    content: 'These terms shall be governed by and construed in accordance with the laws of Morocco. Any disputes arising from these terms shall be resolved exclusively in the courts of Morocco.',
  },
  {
    title: '12. Changes to Terms',
    content: 'ProCNC Maroc reserves the right to update or modify these Terms of Use at any time. We will notify users of material changes via email or a prominent notice on our platform. Continued use after changes constitutes acceptance of the new terms.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TermsOfUse() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.header}
          >
            <h1 style={styles.title}>Terms of Use</h1>
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerDiamond}>✦</span>
              <span style={styles.dividerLine} />
            </div>
            <p style={styles.lastUpdated}>Last updated: June 12, 2026</p>
            <p style={styles.intro}>
              Welcome to ProCNC Maroc. Please read these terms carefully before using our platform.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={styles.sections}
          >
            {sections.map((s, i) => (
              <motion.div key={i} variants={itemVariants} style={styles.card} whileHover={{ borderColor: 'rgba(163,122,57,0.6)', boxShadow: '0 0 20px rgba(163,122,57,0.1)' }}>
                <div style={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</div>
                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{s.title}</h2>
                  <p style={styles.cardContent}>{s.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            style={styles.footer}
          >
            <p style={styles.footerText}>
              If you have any questions about these terms, please{' '}
              <Link to="/contact-us" style={styles.footerLink}>contact us</Link>.
            </p>
            <Link to="/" style={styles.homeLink}>
              <motion.span
                style={styles.homeBtn}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                ← Back to Home
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `url(${machineBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  overlay: {
    minHeight: 'calc(100vh - 70px)',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    padding: 'clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px)',
  },
  container: {
    width: 'min(100%, 800px)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(32px, 5vw, 48px)',
  },
  title: {
    fontSize: 'clamp(28px, 5vw, 40px)',
    color: '#d4af37',
    margin: 0,
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '16px auto',
    maxWidth: '320px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #a37a39, transparent)',
  },
  dividerDiamond: {
    color: '#d4af37',
    fontSize: '14px',
  },
  lastUpdated: {
    color: '#888',
    fontSize: '13px',
    margin: '0 0 12px',
  },
  intro: {
    color: '#bbb',
    fontSize: 'clamp(14px, 2vw, 16px)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 2vw, 16px)',
  },
  card: {
    display: 'flex',
    gap: 'clamp(12px, 2vw, 20px)',
    background: 'linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))',
    border: '1px solid rgba(163,122,57,0.25)',
    borderRadius: '10px',
    padding: 'clamp(16px, 2.5vw, 24px)',
    alignItems: 'flex-start',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  cardIndex: {
    color: '#a37a39',
    fontSize: 'clamp(18px, 2.5vw, 24px)',
    fontWeight: 700,
    fontFamily: 'monospace',
    lineHeight: 1,
    flexShrink: 0,
    width: 'clamp(28px, 3vw, 36px)',
    textAlign: 'right' ,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: '#d4af37',
    fontSize: 'clamp(15px, 2vw, 17px)',
    fontWeight: 600,
    margin: '0 0 6px',
  },
  cardContent: {
    color: '#bbb',
    fontSize: 'clamp(13px, 1.5vw, 14px)',
    lineHeight: 1.7,
    margin: 0,
  },
  footer: {
    textAlign: 'center',
    marginTop: 'clamp(32px, 5vw, 48px)',
  },
  footerText: {
    color: '#999',
    fontSize: '14px',
    margin: '0 0 20px',
  },
  footerLink: {
    color: '#d4af37',
    textDecoration: 'underline',
    fontWeight: 600,
  },
  homeLink: {
    textDecoration: 'none',
    display: 'inline-block',
  },
  homeBtn: {
    display: 'inline-block',
    color: '#fff',
    background: 'linear-gradient(135deg, #a37a39, #c8952e)',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    cursor: 'pointer',
  },
};
