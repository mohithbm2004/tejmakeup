import { Router } from 'express';
import { SiteSettings } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

const defaultSettings = {
  businessName: 'Tej Makeup Artist',
  phone: '+91 91132 32920',
  whatsapp: '+919113232920',
  whatsappMessage: 'Hello Tejas R, I would like to inquire about availability and packages for my upcoming event.',
  email: 'contact@tejmakeup.com',
  instagram: 'https://www.instagram.com/tej_makeupartist?stkn=MXUxcXE1cXZua2F6Yw%3D%3D&utm_source=qr',
  address: 'Bespoke Private Studio, Mumbai | Destination Bookings Worldwide',
  mapsUrl: 'https://maps.google.com',
  workingHours: 'Monday – Sunday: 08:00 AM – 08:00 PM (By Appointment)',
  seoTitle: 'Tej Makeup Artist | Luxury Bridal & Editorial Stylist',
  seoDescription:
    'Haute couture bridal artistry and bespoke beauty styling by Tejas R tailored for unforgettable celebrations.',
  heroHeading: 'Timeless Beauty, Sculpted with Couture Artistry',
  heroSubheading: 'Haute couture bridal artistry and editorial elegance tailored for the most unforgettable celebrations of your life.',
  heroImage: '/images/tejas_hero.jpg'
};

r.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.put('/', protect, async (req, res) => {
  try {
    const updated = await SiteSettings.findOneAndUpdate({}, { $set: req.body }, { upsert: true, new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default r;
