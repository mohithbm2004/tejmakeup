import { Router } from 'express';
import multer from 'multer';
import slugify from 'slugify';
import { Portfolio } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { uploadBuffer, deleteCloudinaryImage } from '../config/cloudinary.js';

const ok = (f) => /^image\/(jpeg|png|webp)$/i.test(f.mimetype);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10e6, files: 12 },
  fileFilter: (req, f, cb) => cb(ok(f) ? null : new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), ok(f))
});

const r = Router();

const uniqueSlug = async (t, id) => {
  const s = slugify(t || 'portfolio', { lower: true, strict: true }) || 'item';
  let n = s,
    i = 1;
  while (await Portfolio.exists({ slug: n, _id: { $ne: id } })) n = `${s}-${i++}`;
  return n;
};

r.get('/', async (req, res) => {
  const { category, featured, page = 1, limit = 24 } = req.query;
  const q = { published: true };
  if (category && category !== 'All') q.category = category;
  if (featured === 'true' || featured === true) q.featured = true;
  res.json(await Portfolio.find(q).sort({ displayOrder: 1, createdAt: -1 }).skip((page - 1) * limit).limit(+limit));
});

r.get('/admin/all', protect, async (req, res) => {
  const { search = '', category, page = 1, limit = 50 } = req.query;
  const q = {};
  if (search) {
    q.title = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
  if (category && category !== 'All') q.category = category;
  res.json({
    items: await Portfolio.find(q).sort({ displayOrder: 1, createdAt: -1 }).skip((page - 1) * limit).limit(+limit),
    total: await Portfolio.countDocuments(q)
  });
});

r.get('/:slug', async (req, res) => {
  const p = await Portfolio.findOne({ slug: req.params.slug, published: true });
  if (!p) return res.status(404).json({ message: 'Not found' });
  
  // Also provide prev and next for luxury detail navigation
  const prev = await Portfolio.findOne({ published: true, displayOrder: { $lt: p.displayOrder } })
    .sort({ displayOrder: -1 })
    .select('slug title coverImage');
  const next = await Portfolio.findOne({ published: true, displayOrder: { $gt: p.displayOrder } })
    .sort({ displayOrder: 1 })
    .select('slug title coverImage');
    
  res.json({ ...p.toObject(), prev, next });
});

r.post('/', protect, upload.array('images', 12), async (req, res) => {
  try {
    const title = req.body.title || 'Untitled Portfolio';
    const imgs = await Promise.all(
      (req.files || []).map(async (f, i) => {
        const u = await uploadBuffer(f.buffer, f.mimetype);
        return { url: u.secure_url, publicId: u.public_id, alt: title, order: i };
      })
    );

    // If images were also sent as existing array or JSON string
    let initialImages = [...imgs];
    if (req.body.existingImages) {
      try {
        const parsed = typeof req.body.existingImages === 'string' ? JSON.parse(req.body.existingImages) : req.body.existingImages;
        if (Array.isArray(parsed)) initialImages = [...parsed, ...initialImages];
      } catch {}
    }

    const coverImage = req.body.coverImage || initialImages[0]?.url || '';

    const doc = await Portfolio.create({
      ...req.body,
      title,
      slug: await uniqueSlug(title),
      images: initialImages,
      coverImage
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

r.put('/:id', protect, upload.array('images', 12), async (req, res) => {
  try {
    const p = await Portfolio.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    const { images, slug, ...fields } = req.body;
    Object.assign(p, fields);

    if (fields.title && fields.title !== p.title) {
      p.slug = await uniqueSlug(fields.title, p._id);
    }

    if (images) {
      try {
        p.images = typeof images === 'string' ? JSON.parse(images) : images;
      } catch {}
    }

    for (const f of req.files || []) {
      const u = await uploadBuffer(f.buffer, f.mimetype);
      p.images.push({
        url: u.secure_url,
        publicId: u.public_id,
        alt: p.title,
        order: p.images.length
      });
    }

    if (req.body.coverImage) {
      p.coverImage = req.body.coverImage;
    } else if (!p.coverImage && p.images[0]) {
      p.coverImage = p.images[0].url;
    }

    await p.save();
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

r.delete('/:id/images/:publicId', protect, async (req, res) => {
  const p = await Portfolio.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });

  const pid = decodeURIComponent(req.params.publicId);
  await deleteCloudinaryImage(pid);

  p.images = p.images.filter((i) => i.publicId !== pid);
  if (p.coverImage && p.images.every((i) => i.url !== p.coverImage)) {
    p.coverImage = p.images[0]?.url || '';
  }
  await p.save();
  res.json(p);
});

r.delete('/:id', protect, async (req, res) => {
  const p = await Portfolio.findByIdAndDelete(req.params.id);
  if (p) {
    await Promise.all((p.images || []).map((i) => deleteCloudinaryImage(i.publicId)));
  }
  res.json({ ok: true });
});

export default r;
