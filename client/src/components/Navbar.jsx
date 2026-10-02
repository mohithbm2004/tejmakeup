import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    { name: 'Book', path: '/book' },
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent py-2.5 sm:py-4'
          : 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE3D5] py-2 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Minimal & Compact */}
        <Link to="/" className="group flex flex-col items-start focus:outline-none">
          <span
            className={`font-serif text-lg sm:text-2xl md:text-3xl tracking-widest uppercase font-medium transition-colors ${
              isTransparent ? 'text-ivory group-hover:text-champagne-300' : 'text-noir group-hover:text-champagne-600'
            }`}
          >
            {settings.businessName || 'Tej Makeup'}
          </span>
          <span
            className={`hidden sm:block text-[8px] uppercase tracking-ultra font-medium transition-colors ${
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

        {/* Mobile Hamburger - Pinned to the far right, no extra buttons */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-1.5 -mr-1.5 focus:outline-none transition-colors ${
            isTransparent ? 'text-ivory hover:text-champagne-300' : 'text-noir hover:text-champagne-600'
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
        </button>
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
