import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

r.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const u = await User.findOne({ email: cleanEmail });
    if (!u || !(await bcrypt.compare(String(password), u.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: u._id, email: u.email }, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: u._id,
        email: u.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

r.get('/me', protect, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ user: u });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
