import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import SEO from './components/SEO';
import { trackVisit } from './api/visitors';
import './App.css';

const PartnerMap = lazy(() => import('./pages/PartnerMap'));
const OurMachines = lazy(() => import('./pages/OurMachines'));
const Products = lazy(() => import('./pages/Products'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const CustomerGallery = lazy(() => import('./pages/CustomerGallery'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MachineDetail = lazy(() => import('./pages/MachineDetail'));
const MyGallery = lazy(() => import('./pages/MyGallery'));
const Profile = lazy(() => import('./pages/Profile'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const CompleteRegistration = lazy(() => import('./pages/CompleteRegistration'));
const PendingApproval = lazy(() => import('./pages/PendingApproval'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname + location.search).catch(() => {});
  }, [location]);

  return null;
}

function ProtectedRoute({ approved, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (approved && !user.is_approved && user.role !== 'admin') {
    if (user.business_bio) return <Navigate to="/pending-approval" replace />;
    return <Navigate to="/complete-registration" replace />;
  }
  return children;
}

/* Wraps ALL public pages; redirects unapproved users away from everything */
function PublicPage({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user && !user.is_approved && user.role !== 'admin') {
    if (user.business_bio) return <Navigate to="/pending-approval" replace />;
    return <Navigate to="/complete-registration" replace />;
  }
  return children;
}

function AppContent() {
  const { loading } = useAuth();
  if (loading) return <Loading text="Loading..." />;
  return (
    <div className="app">
      <SEO />
      <Navbar />
      <PageTracker />
      <main className="main-content">
        <Suspense fallback={<Loading text="Loading..." />}>
          <Routes>
            <Route path="/" element={<PublicPage><Home /></PublicPage>} />
            <Route path="/partner-map" element={<PublicPage><ErrorBoundary><PartnerMap /></ErrorBoundary></PublicPage>} />
            <Route path="/our-machines" element={<PublicPage><ErrorBoundary><OurMachines /></ErrorBoundary></PublicPage>} />
            <Route path="/products" element={<PublicPage><ErrorBoundary><Products /></ErrorBoundary></PublicPage>} />
            <Route path="/about-us" element={<PublicPage><ErrorBoundary><AboutUs /></ErrorBoundary></PublicPage>} />
            <Route path="/contact-us" element={<PublicPage><ErrorBoundary><ContactUs /></ErrorBoundary></PublicPage>} />
            <Route path="/stories" element={<PublicPage><ErrorBoundary><CustomerGallery /></ErrorBoundary></PublicPage>} />
            <Route path="/machines/:id" element={<PublicPage><ErrorBoundary><MachineDetail /></ErrorBoundary></PublicPage>} />
            <Route path="/profile/:id" element={<PublicPage><ErrorBoundary><PublicProfile /></ErrorBoundary></PublicPage>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/profile" element={<ProtectedRoute approved><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
            <Route path="/my-gallery" element={<ProtectedRoute approved><ErrorBoundary><MyGallery /></ErrorBoundary></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute approved><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
