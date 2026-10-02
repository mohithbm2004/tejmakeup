import { Router } from 'express';
import multer from 'multer';
import slugify from 'slugify';
import { Service } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { uploadBuffer, deleteCloudinaryImage } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10e6 }
});

const r = Router();

const uniqueSlug = async (t, id) => {
  const s = slugify(t || 'service', { lower: true, strict: true }) || 'service';
  let n = s,
    i = 1;
  while (await Service.exists({ slug: n, _id: { $ne: id } })) n = `${s}-${i++}`;
  return n;
};

// Public: Get published services
r.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const q = { published: true };
    if (category && category !== 'All') q.category = category;
    if (featured === 'true' || featured === true) q.featured = true;
    const list = await Service.find(q).sort({ displayOrder: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all services
r.get('/admin/all', protect, async (req, res) => {
  try {
    const { search = '', category } = req.query;
    const q = {};
    if (search) {
      q.title = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    if (category && category !== 'All') q.category = category;
    const items = await Service.find(q).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Get single service by slug or id
r.get('/:slug', async (req, res) => {
  try {
    const s =
      (await Service.findOne({ slug: req.params.slug, published: true })) ||
      (req.params.slug.match(/^[0-9a-fA-F]{24}$/) ? await Service.findById(req.params.slug) : null);
    if (!s) return res.status(404).json({ message: 'Service not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create service
r.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, features, duration, price, category, published, featured, displayOrder } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    let image = req.body.image || '';
    let imagePublicId = '';

    if (req.file) {
      const u = await uploadBuffer(req.file.buffer, req.file.mimetype);
      image = u.secure_url;
      imagePublicId = u.public_id;
    }

    let parsedFeatures = [];
    if (features) {
      parsedFeatures = Array.isArray(features)
        ? features
        : typeof features === 'string'
        ? features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [];
    }

    const doc = await Service.create({
      title,
      slug: await uniqueSlug(title),
      description: description || '',
      category: category || 'Bridal',
      features: parsedFeatures,
      duration: duration || '2-3 hours',
      price: price || '',
      image,
      imagePublicId,
      published: published !== 'false' && published !== false,
      featured: featured === 'true' || featured === true,
      displayOrder: Number(displayOrder) || 0
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update service
r.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Service not found' });

    const { title, features, ...fields } = req.body;
    Object.assign(doc, fields);

    if (title && title !== doc.title) {
      doc.title = title;
      doc.slug = await uniqueSlug(title, doc._id);
    }

    if (features !== undefined) {
      doc.features = Array.isArray(features)
        ? features
        : typeof features === 'string'
        ? features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [];
    }

    if (req.file) {
      if (doc.imagePublicId) await deleteCloudinaryImage(doc.imagePublicId);
      const u = await uploadBuffer(req.file.buffer, req.file.mimetype);
      doc.image = u.secure_url;
      doc.imagePublicId = u.public_id;
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

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete service
r.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Service.findByIdAndDelete(req.params.id);
    if (doc && doc.imagePublicId) {
      await deleteCloudinaryImage(doc.imagePublicId);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
