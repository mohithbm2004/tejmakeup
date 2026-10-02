import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPortfolio from './pages/AdminPortfolio';
import AdminServices from './pages/AdminServices';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminBookings from './pages/AdminBookings';
import AdminAbout from './pages/AdminAbout';
import AdminSettings from './pages/AdminSettings';

function App() {
  const isSubpath = window.location.pathname.startsWith('/admin');
  const basename = isSubpath ? '/admin' : '/';

  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter basename={basename}>
            <Routes>
              {/* Public Admin Login */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="portfolio" element={<AdminPortfolio />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
