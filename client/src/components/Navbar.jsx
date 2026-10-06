import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
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
        isOpen
          ? 'bg-[#141210] border-b border-sand-800 py-2.5 sm:py-3 shadow-2xl'
          : isTransparent
          ? 'bg-transparent border-b border-transparent py-2.5 sm:py-4'
          : 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE3D5] py-2 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Minimal & Compact */}
        <Link to="/" className="group flex flex-col items-start focus:outline-none">
          <span
            className={`font-serif text-lg sm:text-2xl md:text-3xl tracking-widest uppercase font-medium transition-colors ${
              isOpen || isTransparent ? 'text-ivory group-hover:text-champagne-300' : 'text-noir group-hover:text-champagne-600'
            }`}
          >
            {settings.businessName || 'Tej Makeup Artist'}
          </span>
          <span
            className={`hidden sm:block text-[8px] uppercase tracking-ultra font-medium transition-colors ${
              isOpen || isTransparent ? 'text-champagne-300' : 'text-champagne-600'
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
            isOpen || isTransparent ? 'text-ivory hover:text-champagne-300' : 'text-noir hover:text-champagne-600'
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
        </button>
      </div>

      {/* Mobile Drawer - High Contrast Solid Luxury Dark Theme */}
      {isOpen && (
        <>
          {/* Backdrop to dismiss on outside click */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-[-1]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden bg-[#141210] border-b border-[#2A241E] px-6 py-8 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-[15px] sm:text-base uppercase tracking-[0.2em] transition-all duration-200 ${
                      isActive
                        ? 'text-champagne-400 font-semibold border-l-2 border-champagne-400 pl-3'
                        : 'text-[#FAF8F2] hover:text-champagne-300 hover:pl-2 font-normal'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-6 border-t border-[#2A241E] flex flex-col space-y-3.5 text-xs text-sand-300">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 text-[#EDE5D8] hover:text-champagne-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-champagne-400" />
                  <span className="font-mono tracking-wider">{settings.phone}</span>
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[#EDE5D8] hover:text-champagne-400 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span className="tracking-wide">WhatsApp Concierge</span>
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
