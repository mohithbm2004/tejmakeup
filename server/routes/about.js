import { Router } from 'express';
import multer from 'multer';
import { About } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { uploadBuffer, deleteCloudinaryImage } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10e6 }
});

const r = Router();

// Public: Get About profile
r.get('/', async (req, res) => {
  try {
    let about = await About.findOne({ published: true });
    if (!about) {
      about = await About.findOne();
    }
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get About profile
r.get('/admin', protect, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        name: 'Tej / Tejaswini',
        title: 'Master Bridal & Editorial Makeup Artist',
        tagline: 'Sculpting timeless radiance with couture artistry',
        experienceYears: 8,
        eventsCompleted: 750,
        clientsSatisfied: 99
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update About profile
r.put('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'secondaryImage', maxCount: 1 }]), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    const { paragraphs, certifications, awards, ...fields } = req.body;
    Object.assign(about, fields);

    if (paragraphs !== undefined) {
      about.paragraphs = Array.isArray(paragraphs)
        ? paragraphs
        : typeof paragraphs === 'string'
        ? paragraphs.split('\n\n').map((p) => p.trim()).filter(Boolean)
        : [];
    }

    if (certifications !== undefined) {
      about.certifications = Array.isArray(certifications)
        ? certifications
        : typeof certifications === 'string'
        ? certifications.split('\n').map((c) => c.trim()).filter(Boolean)
        : [];
    }

    if (awards !== undefined) {
      about.awards = Array.isArray(awards)
        ? awards
        : typeof awards === 'string'
        ? awards.split('\n').map((a) => a.trim()).filter(Boolean)
        : [];
    }

    if (req.files?.image?.[0]) {
      if (about.imagePublicId) await deleteCloudinaryImage(about.imagePublicId);
      const u = await uploadBuffer(req.files.image[0].buffer, req.files.image[0].mimetype);
      about.image = u.secure_url;
      about.imagePublicId = u.public_id;
    }

    if (req.files?.secondaryImage?.[0]) {
      const u = await uploadBuffer(req.files.secondaryImage[0].buffer, req.files.secondaryImage[0].mimetype);
      about.secondaryImage = u.secure_url;
    }

    if (req.body.experienceYears !== undefined) about.experienceYears = Number(req.body.experienceYears);
    if (req.body.eventsCompleted !== undefined) about.eventsCompleted = Number(req.body.eventsCompleted);
    if (req.body.clientsSatisfied !== undefined) about.clientsSatisfied = Number(req.body.clientsSatisfied);
    if (req.body.published !== undefined) about.published = req.body.published === 'true' || req.body.published === true;
    if (req.body.featured !== undefined) about.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.displayOrder !== undefined) about.displayOrder = Number(req.body.displayOrder) || 0;

    await about.save();
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default r;
