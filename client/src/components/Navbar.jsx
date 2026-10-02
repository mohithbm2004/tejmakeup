import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent py-5'
          : 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE3D5] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col items-start focus:outline-none">
          <span
            className={`font-serif text-2xl md:text-3xl tracking-widest uppercase font-medium transition-colors ${
              isTransparent ? 'text-ivory group-hover:text-champagne-300' : 'text-noir group-hover:text-champagne-600'
            }`}
          >
            {settings.businessName || 'Tej Makeup'}
          </span>
          <span
            className={`text-[9px] uppercase tracking-ultra font-medium transition-colors ${
              isTransparent ? 'text-champagne-300' : 'text-champagne-600'
            }`}
          >
            Bridal • Editorial • Occasion
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest transition-colors duration-300 relative py-1 ${
                  isActive
                    ? isTransparent
                      ? 'text-champagne-300 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-champagne-300'
                      : 'text-champagne-600 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-champagne-600'
                    : isTransparent
                    ? 'text-sand-200 hover:text-white'
                    : 'text-sand-700 hover:text-noir'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/book"
            className={`px-6 py-2.5 text-xs uppercase tracking-widest font-medium transition-all duration-300 shadow-sm border ${
              isTransparent
                ? 'bg-ivory text-noir hover:bg-champagne-500 hover:text-white border-transparent'
                : 'bg-noir text-ivory hover:bg-champagne-600 border-transparent hover:border-champagne-400'
            }`}
          >
            BOOK YOUR DATE
          </Link>
        </div>

        {/* Mobile Burger */}
        <div className="flex items-center space-x-3 lg:hidden">
          <Link
            to="/book"
            className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-colors ${
              isTransparent ? 'bg-champagne-600 text-white' : 'bg-noir text-ivory hover:bg-champagne-600'
            }`}
          >
            BOOK NOW
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 focus:outline-none transition-colors ${
              isTransparent ? 'text-ivory hover:text-champagne-300' : 'text-noir hover:text-champagne-600'
            }`}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-ivory-100/98 backdrop-blur-xl border-b border-sand-300 px-6 py-8 space-y-6 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest transition-colors ${
                    isActive ? 'text-champagne-600 font-semibold' : 'text-sand-800 hover:text-noir'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/book"
              className="w-full text-center py-3 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors mt-4"
            >
              Reserve Your Date
            </Link>
          </nav>

          <div className="pt-6 border-t border-sand-300/80 flex flex-col space-y-3 text-xs text-sand-600">
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-champagne-600">
                <Phone className="w-3.5 h-3.5 text-champagne-600" />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-champagne-600"
              >
                <MessageCircle className="w-3.5 h-3.5 text-champagne-600" />
                <span>WhatsApp Concierge</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
