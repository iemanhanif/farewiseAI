import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Loader
import AppLoader from './components/ui/AppLoader';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FlightResults from './pages/FlightResults';
import FavoriteFlights from './pages/FavoriteFlights';
import SearchHistory from './pages/SearchHistory';
import AIChatAssistant from './pages/AIChatAssistant';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Page transition variant — smooth fade + slight slide
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 }
};

const pageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1]
};

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="relative w-14 h-14">
          <div className="absolute top-0 left-0 w-full h-full border-3 border-skyAccent/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-3 border-skyAccent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Guest Route Guard
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    className="w-full"
  >
    {children}
  </motion.div>
);

const RoutesWrapper = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/"       element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/search" element={<PageTransition><FlightResults /></PageTransition>} />

        {/* Guest Only */}
        <Route path="/login"          element={<GuestRoute><PageTransition><Login /></PageTransition></GuestRoute>} />
        <Route path="/register"       element={<GuestRoute><PageTransition><Register /></PageTransition></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><PageTransition><ForgotPassword /></PageTransition></GuestRoute>} />
        <Route path="/reset-password"  element={<GuestRoute><PageTransition><ResetPassword /></PageTransition></GuestRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><PageTransition><FavoriteFlights /></PageTransition></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><PageTransition><SearchHistory /></PageTransition></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><PageTransition><AIChatAssistant /></PageTransition></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><PageTransition><UserProfile /></PageTransition></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show on very first visit this session
    const seen = sessionStorage.getItem('fw_loaded');
    if (!seen) {
      setShowLoader(true);
      sessionStorage.setItem('fw_loaded', '1');
    }
  }, []);

  return (
    <>
      {/* One-time loading screen */}
      {showLoader && (
        <AppLoader onComplete={() => setShowLoader(false)} />
      )}

      <div className="ambient-shell flex flex-col min-h-screen">
        {/* Ambient background effects */}
        <div className="ambient-particles" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="ambient-particle"
              style={{
                left: `${(index * 7 + 3) % 100}%`,
                top:  `${(index * 13 + 5) % 100}%`,
                animationDelay:    `${index * 0.5}s`,
                animationDuration: `${11 + (index % 6) * 1.5}s`
              }}
            />
          ))}
        </div>
        <div className="ambient-grid" aria-hidden="true" />
        <div className="ambient-orb" aria-hidden="true" />
        <div className="ambient-orb ambient-orb--secondary" aria-hidden="true" />

        <Navbar />

        <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <RoutesWrapper />
        </main>

        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
