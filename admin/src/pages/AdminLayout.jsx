import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Sparkles,
  MessageSquare,
  CalendarCheck,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const AdminLayout = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!loading && !isAuthenticated) {
    navigate('/login', { replace: true, state: { from: location } });
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: Image },
    { name: 'Services', path: '/services', icon: Sparkles },
    { name: 'Testimonials', path: '/testimonials', icon: MessageSquare },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: 'About Artist', path: '/about', icon: User },
    { name: 'Site Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-noir text-ivory border-r border-sand-800 flex-shrink-0">
        <div className="p-6 border-b border-sand-800/80">
          <Link to="/" className="block">
            <span className="font-serif text-xl tracking-widest text-ivory uppercase font-medium">
              {settings.businessName || 'Tej Makeup'}
            </span>
            <span className="block text-[9px] uppercase tracking-ultra text-champagne-400 font-medium mt-0.5">
              Atelier CMS Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = item.path === '/';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={isExact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-colors rounded-none ${
                    isActive
                      ? 'bg-champagne-600/30 text-champagne-300 font-semibold border-l-2 border-champagne-400'
                      : 'text-sand-400 hover:text-ivory hover:bg-sand-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sand-800/80 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-sand-400 hover:text-champagne-300 px-4 py-2"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-noir text-ivory p-4 flex items-center justify-between border-b border-sand-800">
        <div>
          <span className="font-serif text-lg tracking-wider uppercase font-medium">Atelier CMS</span>
          <span className="block text-[8px] uppercase tracking-ultra text-champagne-400">Admin Control</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-sand-300 hover:text-ivory"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-noir text-ivory border-b border-sand-800 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-wider text-sand-300 hover:text-ivory"
              >
                <Icon className="w-4 h-4 text-champagne-400" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-3 border-t border-sand-800 flex items-center justify-between">
            <Link to="/" target="_blank" className="text-xs text-sand-400">
              View Site
            </Link>
            <button onClick={logout} className="text-xs text-red-400 font-medium">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
