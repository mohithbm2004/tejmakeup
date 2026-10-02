import { Router } from 'express';
import multer from 'multer';
import { Testimonial } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { uploadBuffer, deleteCloudinaryImage } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10e6 }
});

const r = Router();

// Public: Get published testimonials
r.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const q = { published: true };
    if (featured === 'true' || featured === true) q.featured = true;
    const list = await Testimonial.find(q).sort({ displayOrder: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all testimonials
r.get('/admin/all', protect, async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create testimonial
r.post('/', protect, upload.single('avatar'), async (req, res) => {
  try {
    const { clientName, role, content, rating, location, eventDate, published, featured, displayOrder } = req.body;
    if (!clientName || !content) {
      return res.status(400).json({ message: 'Client name and review content are required' });
    }

    let avatar = req.body.avatar || '';
    let avatarPublicId = '';

    if (req.file) {
      const u = await uploadBuffer(req.file.buffer, req.file.mimetype);
      avatar = u.secure_url;
      avatarPublicId = u.public_id;
    }

    const doc = await Testimonial.create({
      clientName,
      role: role || 'Bride',
      content,
      rating: Number(rating) || 5,
      location: location || '',
      eventDate: eventDate ? new Date(eventDate) : undefined,
      avatar,
      avatarPublicId,
      published: published !== 'false' && published !== false,
      featured: featured === 'true' || featured === true,
      displayOrder: Number(displayOrder) || 0
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update testimonial
r.put('/:id', protect, upload.single('avatar'), async (req, res) => {
  try {
    const doc = await Testimonial.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Testimonial not found' });

    Object.assign(doc, req.body);

    if (req.file) {
      if (doc.avatarPublicId) await deleteCloudinaryImage(doc.avatarPublicId);
      const u = await uploadBuffer(req.file.buffer, req.file.mimetype);
      doc.avatar = u.secure_url;
      doc.avatarPublicId = u.public_id;
    }

    if (req.body.published !== undefined) {
      doc.published = req.body.published === 'true' || req.body.published === true;
    }
    if (req.body.featured !== undefined) {
      doc.featured = req.body.featured === 'true' || req.body.featured === true;
    }
    if (req.body.displayOrder !== undefined) {
      doc.displayOrder = Number(req.body.displayOrder) || 0;
    }
    if (req.body.rating !== undefined) {
      doc.rating = Number(req.body.rating) || 5;
    }

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete testimonial
r.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (doc && doc.avatarPublicId) {
      await deleteCloudinaryImage(doc.avatarPublicId);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
