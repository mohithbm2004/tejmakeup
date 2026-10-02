import { Router } from 'express';
import multer from 'multer';
import { BeforeAfter } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { uploadBuffer, deleteCloudinaryImage } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10e6 }
});

const r = Router();

// Public: Get all published before/after transformations
r.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const q = { published: true };
    if (category && category !== 'All') q.category = category;
    if (featured === 'true' || featured === true) q.featured = true;
    const list = await BeforeAfter.find(q).sort({ displayOrder: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all before/after items
r.get('/admin/all', protect, async (req, res) => {
  try {
    const items = await BeforeAfter.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create before/after transformation
r.post(
  '/',
  protect,
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, category, description, published, featured, displayOrder } = req.body;
      if (!title) return res.status(400).json({ message: 'Title is required' });

      let beforeImage = req.body.beforeImageUrl || '';
      let beforeImagePublicId = '';
      let afterImage = req.body.afterImageUrl || '';
      let afterImagePublicId = '';

      if (req.files?.beforeImage?.[0]) {
        const u = await uploadBuffer(req.files.beforeImage[0].buffer, req.files.beforeImage[0].mimetype);
        beforeImage = u.secure_url;
        beforeImagePublicId = u.public_id;
      }

      if (req.files?.afterImage?.[0]) {
        const u = await uploadBuffer(req.files.afterImage[0].buffer, req.files.afterImage[0].mimetype);
        afterImage = u.secure_url;
        afterImagePublicId = u.public_id;
      }

      if (!beforeImage || !afterImage) {
        return res.status(400).json({ message: 'Both Before and After images are required' });
      }

      const doc = await BeforeAfter.create({
        title,
        category: category || 'Bridal',
        description: description || '',
        beforeImage,
        beforeImagePublicId,
        afterImage,
        afterImagePublicId,
        published: published !== 'false' && published !== false,
        featured: featured === 'true' || featured === true,
        displayOrder: Number(displayOrder) || 0
      });

      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Admin: Update before/after transformation
r.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const doc = await BeforeAfter.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });

      Object.assign(doc, req.body);

      if (req.files?.beforeImage?.[0]) {
        if (doc.beforeImagePublicId) await deleteCloudinaryImage(doc.beforeImagePublicId);
        const u = await uploadBuffer(req.files.beforeImage[0].buffer, req.files.beforeImage[0].mimetype);
        doc.beforeImage = u.secure_url;
        doc.beforeImagePublicId = u.public_id;
      }

      if (req.files?.afterImage?.[0]) {
        if (doc.afterImagePublicId) await deleteCloudinaryImage(doc.afterImagePublicId);
        const u = await uploadBuffer(req.files.afterImage[0].buffer, req.files.afterImage[0].mimetype);
        doc.afterImage = u.secure_url;
        doc.afterImagePublicId = u.public_id;
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
  }
);

// Admin: Delete before/after transformation
r.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await BeforeAfter.findByIdAndDelete(req.params.id);
    if (doc) {
      if (doc.beforeImagePublicId) await deleteCloudinaryImage(doc.beforeImagePublicId);
      if (doc.afterImagePublicId) await deleteCloudinaryImage(doc.afterImagePublicId);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
