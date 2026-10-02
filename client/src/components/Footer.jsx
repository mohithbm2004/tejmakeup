import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, Clock, MessageCircle, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sand-100 text-noir border-t border-sand-300/80 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-sand-300/70">
          {/* Brand Col */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-widest text-noir uppercase font-medium">
                {settings.businessName || 'Tej Makeup'}
              </span>
              <span className="block text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold mt-1">
                Luxury Bridal & Editorial Artistry
              </span>
            </Link>
            <p className="text-sand-700 text-xs leading-relaxed max-w-sm">
              Crafting timeless, skin-first radiance and bespoke bridal couture for extraordinary celebrations across India and worldwide.
            </p>
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-noir hover:text-champagne-600 transition-colors font-medium"
              >
                <Instagram className="w-4 h-4 text-champagne-600" />
                <span>Follow on Instagram</span>
              </a>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg tracking-wider text-noir font-medium uppercase">Navigation</h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-sand-700">
              <li>
                <Link to="/" className="hover:text-champagne-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-champagne-600 transition-colors">The Artist</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-champagne-600 transition-colors">Services & Pricing</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-champagne-600 transition-colors">Portfolio Gallery</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-champagne-600 transition-colors">Client Love</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne-600 transition-colors">Contact & Studio</Link>
              </li>
            </ul>
          </div>

          {/* Studio & Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg tracking-wider text-noir font-medium uppercase">Studio & Hours</h4>
            <div className="space-y-3 text-xs text-sand-700">
              {settings.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-champagne-600 flex-shrink-0 mt-0.5" />
                  <a
                    href={settings.mapsUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-champagne-600 leading-relaxed transition-colors"
                  >
                    {settings.address}
                  </a>
                </div>
              )}
              {settings.workingHours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-champagne-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.workingHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Concierge & Inquiries */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg tracking-wider text-noir font-medium uppercase">Private Concierge</h4>
            <p className="text-xs text-sand-700 leading-relaxed">
              Dates for the current and upcoming wedding seasons fill rapidly. Early inquiry is recommended.
            </p>
            <div className="space-y-2.5 text-xs">
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sand-800 hover:text-champagne-600">
                  <Phone className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sand-800 hover:text-champagne-600">
                  <Mail className="w-3.5 h-3.5 text-champagne-600" />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    settings.whatsappMessage || 'Hello Tej'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-champagne-700 font-semibold hover:text-champagne-600 pt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-sand-600 tracking-wider gap-4">
          <p>© {currentYear} {settings.businessName}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/book" className="hover:text-champagne-600 uppercase tracking-widest">
              Reserve Date
            </Link>
            <Link to="/admin" className="inline-flex items-center gap-1 hover:text-champagne-600 uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
