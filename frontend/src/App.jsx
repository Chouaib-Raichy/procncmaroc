import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Home from './pages/Home';
import PartnerMap from './pages/PartnerMap';
import OurMachines from './pages/OurMachines';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CustomerGallery from './pages/CustomerGallery';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MachineDetail from './pages/MachineDetail';
import MyGallery from './pages/MyGallery';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import CompleteRegistration from './pages/CompleteRegistration';
import PendingApproval from './pages/PendingApproval';
import TermsOfUse from './pages/TermsOfUse';
import NotFound from './pages/NotFound';
import { trackVisit } from './api/visitors';
import './App.css';

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
      <Navbar />
      <PageTracker />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PublicPage><Home /></PublicPage>} />
          <Route path="/partner-map" element={<PublicPage><ErrorBoundary><PartnerMap /></ErrorBoundary></PublicPage>} />
          <Route path="/our-machines" element={<PublicPage><ErrorBoundary><OurMachines /></ErrorBoundary></PublicPage>} />
          <Route path="/products" element={<PublicPage><ErrorBoundary><Products /></ErrorBoundary></PublicPage>} />
          <Route path="/about-us" element={<PublicPage><ErrorBoundary><AboutUs /></ErrorBoundary></PublicPage>} />
          <Route path="/contact-us" element={<PublicPage><ErrorBoundary><ContactUs /></ErrorBoundary></PublicPage>} />
          <Route path="/customer-gallery" element={<PublicPage><ErrorBoundary><CustomerGallery /></ErrorBoundary></PublicPage>} />
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
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
