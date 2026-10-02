import { Router } from 'express';
import { Portfolio, Service, Testimonial, Booking, BeforeAfter } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const r = Router();

r.get('/', protect, async (req, res) => {
  try {
    const [
      portfolioTotal,
      portfolioPublished,
      portfolioFeatured,
      servicesTotal,
      servicesPublished,
      servicesFeatured,
      testimonialsTotal,
      testimonialsPublished,
      testimonialsFeatured,
      bookingsTotal,
      bookingsNew,
      bookingsConfirmed,
      beforeAfterTotal,
      beforeAfterPublished,
      recentBookings
    ] = await Promise.all([
      Portfolio.countDocuments(),
      Portfolio.countDocuments({ published: true }),
      Portfolio.countDocuments({ featured: true }),
      Service.countDocuments(),
      Service.countDocuments({ published: true }),
      Service.countDocuments({ featured: true }),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ published: true }),
      Testimonial.countDocuments({ featured: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'New' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      BeforeAfter.countDocuments(),
      BeforeAfter.countDocuments({ published: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      portfolio: {
        total: portfolioTotal,
        published: portfolioPublished,
        featured: portfolioFeatured
      },
      services: {
        total: servicesTotal,
        published: servicesPublished,
        featured: servicesFeatured
      },
      testimonials: {
        total: testimonialsTotal,
        published: testimonialsPublished,
        featured: testimonialsFeatured
      },
      bookings: {
        total: bookingsTotal,
        new: bookingsNew,
        confirmed: bookingsConfirmed
      },
      beforeAfter: {
        total: beforeAfterTotal,
        published: beforeAfterPublished
      },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default r;
