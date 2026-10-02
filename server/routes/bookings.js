import { Router } from 'express';
import { Booking } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

// Public: Submit booking inquiry with validation
r.post('/', async (req, res) => {
  try {
    const { name, phone, email, eventType, eventDate, location, preferredTime, people, services, budget, message } =
      req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ message: 'Valid phone number is required' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!eventType || typeof eventType !== 'string' || !eventType.trim()) {
      return res.status(400).json({ message: 'Event type is required' });
    }

    if (!eventDate || isNaN(new Date(eventDate).getTime())) {
      return res.status(400).json({ message: 'Valid event date is required' });
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const doc = await Booking.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      eventType: eventType.trim(),
      eventDate: new Date(eventDate),
      location: location.trim(),
      preferredTime: preferredTime || '',
      people: Number(people) || 1,
      services: Array.isArray(services) ? services : typeof services === 'string' ? [services] : [],
      budget: budget || '',
      message: message || '',
      status: 'New'
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all bookings (with optional status & search filter)
r.get('/', protect, async (req, res) => {
  try {
    const { status, search } = req.query;
    const q = {};
    if (status && status !== 'All') q.status = status;
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      q.$or = [{ name: re }, { phone: re }, { email: re }, { location: re }, { eventType: re }];
    }
    const bookings = await Booking.find(q).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update booking status or details
r.put('/:id', protect, async (req, res) => {
  try {
    const allowedStatuses = ['New', 'Contacted', 'Discussion', 'Confirmed', 'Completed', 'Cancelled'];
    const updateData = {};
    if (req.body.status && allowedStatuses.includes(req.body.status)) {
      updateData.status = req.body.status;
    }
    if (req.body.message !== undefined) updateData.message = req.body.message;
    if (req.body.budget !== undefined) updateData.budget = req.body.budget;
    if (req.body.preferredTime !== undefined) updateData.preferredTime = req.body.preferredTime;

    const doc = await Booking.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Booking not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete booking
r.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Booking.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Booking not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
