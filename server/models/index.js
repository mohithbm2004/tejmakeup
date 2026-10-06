import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const User = model(
  'User',
  new Schema(
    {
      email: { type: String, unique: true, required: true, trim: true, lowercase: true },
      password: { type: String, required: true }
    },
    { timestamps: true }
  )
);

export const Portfolio = model(
  'Portfolio',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      slug: { type: String, unique: true, index: true },
      category: { type: String, index: true, default: 'Bridal' },
      location: { type: String, default: '' },
      eventDate: { type: Date },
      description: { type: String, default: '' },
      images: [
        {
          url: { type: String, required: true },
          publicId: { type: String, default: '' },
          alt: { type: String, default: '' },
          order: { type: Number, default: 0 }
        }
      ],
      coverImage: { type: String, default: '' },
      featured: { type: Boolean, default: false, index: true },
      published: { type: Boolean, default: true, index: true },
      displayOrder: { type: Number, default: 0, index: true }
    },
    { timestamps: true }
  )
);

export const Service = model(
  'Service',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      slug: { type: String, unique: true, index: true },
      category: { type: String, default: 'Bridal' },
      tagline: { type: String, default: '' },
      description: { type: String, default: '' },
      features: [{ type: String }],
      duration: { type: String, default: '2-3 hours' },
      price: { type: String, default: '' },
      image: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      published: { type: Boolean, default: true, index: true },
      featured: { type: Boolean, default: false, index: true },
      displayOrder: { type: Number, default: 0, index: true }
    },
    { timestamps: true }
  )
);

export const Testimonial = model(
  'Testimonial',
  new Schema(
    {
      clientName: { type: String, required: true, trim: true },
      role: { type: String, default: 'Bride' },
      content: { type: String, required: true },
      rating: { type: Number, default: 5, min: 1, max: 5 },
      eventDate: { type: Date },
      avatar: { type: String, default: '' },
      avatarPublicId: { type: String, default: '' },
      location: { type: String, default: '' },
      published: { type: Boolean, default: true, index: true },
      featured: { type: Boolean, default: false, index: true },
      displayOrder: { type: Number, default: 0, index: true }
    },
    { timestamps: true }
  )
);

export const About = model(
  'About',
  new Schema(
    {
      name: { type: String, default: 'Tejas R' },
      title: { type: String, default: 'Celebrity, Bridal & Haute Couture Makeup Artist' },
      tagline: { type: String, default: 'Sculpting timeless radiance with couture artistry' },
      bio: { type: String, default: '' },
      paragraphs: [{ type: String }],
      experienceYears: { type: Number, default: 8 },
      eventsCompleted: { type: Number, default: 750 },
      clientsSatisfied: { type: Number, default: 99 },
      image: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      secondaryImage: { type: String, default: '' },
      philosophy: { type: String, default: '' },
      signatureStyle: { type: String, default: '' },
      certifications: [{ type: String }],
      awards: [{ type: String }],
      published: { type: Boolean, default: true },
      featured: { type: Boolean, default: false },
      displayOrder: { type: Number, default: 0 }
    },
    { timestamps: true }
  )
);

export const BeforeAfter = model(
  'BeforeAfter',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      category: { type: String, default: 'Bridal' },
      description: { type: String, default: '' },
      beforeImage: { type: String, required: true },
      beforeImagePublicId: { type: String, default: '' },
      afterImage: { type: String, required: true },
      afterImagePublicId: { type: String, default: '' },
      published: { type: Boolean, default: true, index: true },
      featured: { type: Boolean, default: false, index: true },
      displayOrder: { type: Number, default: 0, index: true }
    },
    { timestamps: true }
  )
);

export const Booking = model(
  'Booking',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: '', trim: true },
      eventType: { type: String, required: true },
      eventDate: { type: Date, required: true },
      location: { type: String, required: true },
      preferredTime: { type: String, default: '' },
      people: { type: Number, default: 1 },
      services: [{ type: String }],
      budget: { type: String, default: '' },
      message: { type: String, default: '' },
      status: {
        type: String,
        enum: ['New', 'Contacted', 'Discussion', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'New',
        index: true
      }
    },
    { timestamps: true }
  )
);

export const SiteSettings = model(
  'SiteSettings',
  new Schema(
    {
      businessName: { type: String, default: 'Tej Makeup Artist' },
      phone: { type: String, default: '+91 91132 32920' },
      whatsapp: { type: String, default: '+919113232920' },
      whatsappMessage: {
        type: String,
        default: 'Hi Tejas R, I would love to inquire about availability for my upcoming wedding/event!'
      },
      email: { type: String, default: 'contact@tejmakeup.com' },
      instagram: { type: String, default: 'https://www.instagram.com/tej_makeupartist?stkn=MXUxcXE1cXZua2F6Yw%3D%3D&utm_source=qr' },
      address: { type: String, default: 'Bespoke Studio, Mumbai / Available Worldwide' },
      mapsUrl: { type: String, default: 'https://maps.google.com' },
      workingHours: { type: String, default: 'Mon - Sun: 08:00 AM - 08:00 PM (By Appointment)' },
      seoTitle: { type: String, default: 'Tej Makeup Artist | Luxury Bridal & Editorial Stylist' },
      seoDescription: {
        type: String,
        default:
          'High-end luxury makeup artist Tejas R specializing in bespoke bridal, red carpet, and editorial artistry with timeless dewy elegance.'
      },
      heroHeading: { type: String, default: 'Timeless Beauty, Sculpted to Perfection' },
      heroSubheading: {
        type: String,
        default: 'Haute couture bridal artistry and editorial elegance tailored for unforgettable moments.'
      },
      heroImage: { type: String, default: '' }
    },
    { timestamps: true }
  )
);
