import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const FloatingWhatsApp = () => {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!settings.whatsapp) return null;

  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(
    settings.whatsappMessage || 'Hi Tej, I would love to check your availability for my upcoming wedding/event!'
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden md:flex mr-3 bg-white/90 backdrop-blur-md border border-champagne-300 text-noir text-xs py-2 px-3.5 shadow-lg rounded-none tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium">Direct Bridal Concierge</span>
      </div>

      {/* Main button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative border-2 border-white/60 focus:outline-none"
        aria-label="Chat with Tej on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 stroke-[1.8]" />
        {/* Subtle pulsing badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white"></span>
        </span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
