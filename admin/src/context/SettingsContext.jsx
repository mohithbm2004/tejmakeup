import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SettingsContext = createContext(null);

export const defaultSettings = {
  businessName: 'Tej Makeup Artist',
  phone: '+91 91132 32920',
  whatsapp: '+919113232920',
  whatsappMessage: 'Hi Tejas R, I would like to inquire about availability for my upcoming wedding/event!',
  email: 'concierge@tejmakeup.com',
  instagram: 'https://www.instagram.com/tej_makeupartist?stkn=MXUxcXE1cXZua2F6Yw%3D%3D&utm_source=qr',
  address: 'Bespoke Private Studio, Bandra West, Mumbai | Worldwide Destination Bookings',
  mapsUrl: 'https://maps.google.com/?q=Bandra+West+Mumbai',
  workingHours: 'Mon - Sun: 08:00 AM - 08:00 PM (By Appointment)',
  seoTitle: 'Tej Makeup Artist | Luxury Bridal & Editorial Stylist',
  seoDescription:
    'Haute couture bridal artistry and bespoke beauty styling by Tejas R tailored for unforgettable celebrations.',
  heroHeading: 'Timeless Beauty, Sculpted with Couture Artistry',
  heroSubheading:
    'Haute couture bridal artistry and editorial elegance tailored for the most unforgettable celebrations of your life.',
  heroImage: '/images/IMG_1465.jpg'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && Object.keys(res.data).length > 0) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Failed to fetch site settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newData) => {
    const res = await api.put('/settings', newData);
    setSettings((prev) => ({ ...prev, ...res.data }));
    return res.data;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
