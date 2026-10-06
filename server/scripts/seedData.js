import 'dotenv/config';
import { Portfolio, Service, Testimonial, Booking, BeforeAfter, About, SiteSettings } from '../models/index.js';
import { connectDB } from '../config/db.js';

await connectDB();

console.log('[Seed] Seeding sample data for Tej Makeup Artist using local project photography...');

// Clear existing sample collections (preserving users)
await Promise.all([
  Portfolio.deleteMany({}),
  Service.deleteMany({}),
  Testimonial.deleteMany({}),
  Booking.deleteMany({}),
  BeforeAfter.deleteMany({}),
  About.deleteMany({}),
  SiteSettings.deleteMany({})
]);

// 1. Portfolio Items (10 items using authentic project photos)
const portfolioData = [
  {
    title: 'The Royal Amber Palace Wedding',
    slug: 'the-royal-amber-palace-wedding',
    category: 'Bridal',
    location: 'Jaipur, Rajasthan',
    eventDate: new Date('2025-11-18'),
    description:
      'A majestic heritage bridal look crafted for a palace wedding. Soft crimson velvet hues, sculpted cheekbones, and radiant 24k gold leaf eye accents designed to withstand 14 hours of celebration flawlessly.',
    images: [
      {
        url: '/images/IMG_1465.jpg',
        publicId: 'local_img_1465',
        alt: 'Royal Amber Palace Bride Full Portrait',
        order: 0
      },
      {
        url: '/images/IMG_1466.jpg',
        publicId: 'local_img_1466',
        alt: 'Close up soft glam eyes and veil detail',
        order: 1
      }
    ],
    coverImage: '/images/IMG_1465.jpg',
    featured: true,
    published: true,
    displayOrder: 1
  },
  {
    title: 'Gilded Radiance Reception',
    slug: 'gilded-radiance-reception',
    category: 'Reception',
    location: 'The St. Regis, Mumbai',
    eventDate: new Date('2025-12-04'),
    description:
      'Ultra-luminous glass skin paired with champagne metallic shimmer on eyelids and sculpted glossy lips, harmonizing with an emerald couture lehenga.',
    images: [
      {
        url: '/images/IMG_5119.jpg',
        publicId: 'local_img_5119',
        alt: 'Reception Glamour Portrait',
        order: 0
      },
      {
        url: '/images/IMG_5125.jpg',
        publicId: 'local_img_5125',
        alt: 'Dewy skin glow and couture jewelry',
        order: 1
      }
    ],
    coverImage: '/images/IMG_5119.jpg',
    featured: true,
    published: true,
    displayOrder: 2
  },
  {
    title: 'Vogue India Haute Editorial',
    slug: 'vogue-india-haute-editorial',
    category: 'Editorial',
    location: 'Studio 11, New Delhi',
    eventDate: new Date('2026-01-12'),
    description:
      'High-fashion graphic symmetry meets raw skin texture. Minimalist micro-concealing with wet-look terracotta wash on lids and bleached brushed arches.',
    images: [
      {
        url: '/images/IMG_4404.jpg',
        publicId: 'local_img_4404',
        alt: 'Vogue Editorial Front Angle',
        order: 0
      },
      {
        url: '/images/IMG_4403.jpg',
        publicId: 'local_img_4403',
        alt: 'Editorial Profile and Cheek Architecture',
        order: 1
      },
      {
        url: '/images/IMG_4405.jpg',
        publicId: 'local_img_4405',
        alt: 'Couture Editorial Macro Details',
        order: 2
      }
    ],
    coverImage: '/images/IMG_4404.jpg',
    featured: true,
    published: true,
    displayOrder: 3
  },
  {
    title: 'Ethereal Sunset Engagement',
    slug: 'ethereal-sunset-engagement',
    category: 'Engagement',
    location: 'Taj Lake Palace, Udaipur',
    eventDate: new Date('2026-01-28'),
    description:
      'Dreamy sunset tones with soft rose gold lids, fluttering feathered lashes, and a petal-pink stain on lips, reflecting Lake Pichola’s golden hour glow.',
    images: [
      {
        url: '/images/IMG_5555.jpg',
        publicId: 'local_img_5555',
        alt: 'Engagement portrait in pastel peach outfit',
        order: 0
      },
      {
        url: '/images/IMG_5560.jpg',
        publicId: 'local_img_5560',
        alt: 'Sunset glow close-up',
        order: 1
      }
    ],
    coverImage: '/images/IMG_5555.jpg',
    featured: false,
    published: true,
    displayOrder: 4
  },
  {
    title: 'Couture Red Carpet Glamour',
    slug: 'couture-red-carpet-glamour',
    category: 'Glamour',
    location: 'Cannes, France',
    eventDate: new Date('2025-05-19'),
    description:
      'Timeless Hollywood starlet aesthetic reinterpreted: smoldering smoked espresso wings, sculpted cheek architecture, and deep satin lips.',
    images: [
      {
        url: '/images/IMG_6748.jpg',
        publicId: 'local_img_6748',
        alt: 'Red carpet evening glam',
        order: 0
      },
      {
        url: '/images/IMG_6778.jpg',
        publicId: 'local_img_6778',
        alt: 'Sculpted cheek and luminous collarbone',
        order: 1
      },
      {
        url: '/images/IMG_6784.jpg',
        publicId: 'local_img_6784',
        alt: 'Evening lighting profile',
        order: 2
      }
    ],
    coverImage: '/images/IMG_6748.jpg',
    featured: true,
    published: true,
    displayOrder: 5
  },
  {
    title: 'Noor - The Modern Minimalist Bride',
    slug: 'noor-the-modern-minimalist-bride',
    category: 'Bridal',
    location: 'Bengaluru Heritage Club',
    eventDate: new Date('2026-02-10'),
    description:
      'Subtle luxury for the bride who wants to look authentically herself. Skin preparation using botanical serums, micro-blended foundation, and warm kohl-rimmed waterlines.',
    images: [
      {
        url: '/images/IMG_7442.jpg',
        publicId: 'local_img_7442',
        alt: 'Modern minimalist bride Noor',
        order: 0
      },
      {
        url: '/images/IMG_7443.jpg',
        publicId: 'local_img_7443',
        alt: 'Delicate kohl and skin radiance detail',
        order: 1
      }
    ],
    coverImage: '/images/IMG_7442.jpg',
    featured: false,
    published: true,
    displayOrder: 6
  },
  {
    title: 'Dewy Opulence Sangeet Night',
    slug: 'dewy-opulence-sangeet-night',
    category: 'Sangeet',
    location: 'Falaknuma Palace, Hyderabad',
    eventDate: new Date('2026-02-22'),
    description:
      'High-impact sweat-proof glam made for dancing all night under crystal chandeliers. Multi-dimensional chromatic eye pigment and bronzed warm undertones.',
    images: [
      {
        url: '/images/IMG_1922.jpg',
        publicId: 'local_img_1922',
        alt: 'Dewy Sangeet makeup look',
        order: 0
      },
      {
        url: '/images/IMG_1923.jpg',
        publicId: 'local_img_1923',
        alt: 'Close-up glitter pigment details',
        order: 1
      },
      {
        url: '/images/IMG_1925.jpg',
        publicId: 'local_img_1925',
        alt: 'Luminous cheek finish',
        order: 2
      }
    ],
    coverImage: '/images/IMG_1922.jpg',
    featured: false,
    published: true,
    displayOrder: 7
  },
  {
    title: 'Harper’s Bazaar Cover Story',
    slug: 'harpers-bazaar-cover-story',
    category: 'Editorial',
    location: 'Milan, Italy',
    eventDate: new Date('2025-09-15'),
    description:
      'A study in light, shadow, and architectural elegance. High-definition camera-ready skin with matte contours and subtle glass-balm highlights.',
    images: [
      {
        url: '/images/IMG_4391.jpg',
        publicId: 'local_img_4391',
        alt: 'Editorial shoot Milan',
        order: 0
      },
      {
        url: '/images/IMG_4838.jpg',
        publicId: 'local_img_4838',
        alt: 'Architectural beauty lighting',
        order: 1
      }
    ],
    coverImage: '/images/IMG_4391.jpg',
    featured: true,
    published: true,
    displayOrder: 8
  },
  {
    title: 'Mediterranean Sun-Kissed Destination',
    slug: 'mediterranean-sun-kissed-destination',
    category: 'Bridal',
    location: 'Amalfi Coast, Italy',
    eventDate: new Date('2025-07-20'),
    description:
      'Bespoke destination wedding styling that withstands seaside breezes and Mediterranean humidity with luminous bronzed undertones and effortless elegance.',
    images: [
      {
        url: '/images/IMG_5149.jpg',
        publicId: 'local_img_5149',
        alt: 'Destination Bride Amalfi',
        order: 0
      },
      {
        url: '/images/IMG_5164.jpg',
        publicId: 'local_img_5164',
        alt: 'Natural sunlight and veil texture',
        order: 1
      }
    ],
    coverImage: '/images/IMG_5149.jpg',
    featured: false,
    published: true,
    displayOrder: 9
  },
  {
    title: 'Velvet Twilight Cocktail Affair',
    slug: 'velvet-twilight-cocktail-affair',
    category: 'Glamour',
    location: 'W Goa, Vagator',
    eventDate: new Date('2025-11-30'),
    description:
      'Dramatic feline liner, smoked charcoal edges, and a nude satin lip tailored for an intimate twilight oceanfront celebration.',
    images: [
      {
        url: '/images/IMG_8231.jpg',
        publicId: 'local_img_8231',
        alt: 'Velvet twilight glam',
        order: 0
      },
      {
        url: '/images/IMG_8233.jpg',
        publicId: 'local_img_8233',
        alt: 'Twilight oceanfront evening portrait',
        order: 1
      }
    ],
    coverImage: '/images/IMG_8231.jpg',
    featured: false,
    published: true,
    displayOrder: 10
  }
];

await Portfolio.insertMany(portfolioData);
console.log('[Seed] Created 10 portfolio items using local project photography');

// 2. Services (6 services using authentic project photos)
const serviceData = [
  {
    title: 'Haute Couture Bridal Artistry',
    slug: 'haute-couture-bridal-artistry',
    category: 'Bridal',
    tagline: 'The quintessential wedding day transformation for the discerning bride.',
    description:
      'An uncompromising luxury bridal experience beginning with skin barrier prep, customized high-definition application, luxury lash couture, dupattā/veil draping, and jewelry setting. Engineered for 16-hour endurance under 4K lenses.',
    features: [
      'Comprehensive pre-wedding skin consultation & look curation',
      'Luxury skincare infusion (Augustinus Bader, La Mer & Charlotte Tilbury)',
      'Customized mink-feel cruelty-free individual lash mapping',
      'Haute couture dupattā, veil draping & heirloom jewelry placement',
      'Luxury on-site touchup kit & aftercare essentials'
    ],
    duration: '3.5 - 4 Hours',
    price: 'From ₹35,000 / $450',
    image: '/images/IMG_1465.jpg',
    featured: true,
    published: true,
    displayOrder: 1
  },
  {
    title: 'Royal Sangeet & Reception Glamour',
    slug: 'royal-sangeet-and-reception-glamour',
    category: 'Reception',
    tagline: 'High-wattage drama, jewel tones, and luminous camera-ready radiance.',
    description:
      'Designed for evenings bathed in chandeliers and celebratory dance floors. Features sweat-resistant chromatic pigment, sculpted cheekbones, and long-wearing satin lips.',
    features: [
      'Multi-dimensional metallic or smoked eye techniques',
      'Advanced waterproof, sweat-resistant contour sculpting',
      'Editorial hair styling & accessory integration',
      'Body shimmer and dewy collarbone highlight'
    ],
    duration: '2.5 - 3 Hours',
    price: 'From ₹25,000 / $320',
    image: '/images/IMG_5119.jpg',
    featured: true,
    published: true,
    displayOrder: 2
  },
  {
    title: 'Pre-Wedding & Engagement Styling',
    slug: 'pre-wedding-and-engagement-styling',
    category: 'Engagement',
    tagline: 'Soft, romantic, and ethereal aesthetics tailored for intimate rituals.',
    description:
      'Soft-focus, pastel-friendly aesthetics engineered for outdoor natural sunlight, sunset portraits, and traditional ring exchange ceremonies.',
    features: [
      'Daylight-optimized dewy skin finish',
      'Natural textured brow lamination effect',
      'Customized floral hair accents or contemporary waves',
      'Hydrating lip tinting & natural flush contour'
    ],
    duration: '2 Hours',
    price: 'From ₹20,000 / $260',
    image: '/images/IMG_5555.jpg',
    featured: false,
    published: true,
    displayOrder: 3
  },
  {
    title: 'Editorial, Fashion & Campaign Artistry',
    slug: 'editorial-fashion-and-campaign-artistry',
    category: 'Editorial',
    tagline: 'Runway-level conceptual artistry for magazines, lookbooks, and campaigns.',
    description:
      'Collaborative artistic direction for designer campaigns, commercial print, and red carpet events. Specialized in avant-garde textures, graphic precision, and raw high-fashion finishes.',
    features: [
      'Full-day or half-day set standby & lighting coordination',
      'Texture experimentation (gloss lids, graphic liner, minimalist skin)',
      'High-speed transitions between designer looks',
      'Post-production color & lighting consultation'
    ],
    duration: 'Half Day / Full Day',
    price: 'Price Upon Request',
    image: '/images/IMG_4404.jpg',
    featured: true,
    published: true,
    displayOrder: 4
  },
  {
    title: 'Destination Wedding Bridal Suite',
    slug: 'destination-wedding-bridal-suite',
    category: 'Bridal',
    tagline: 'Comprehensive global travel package for multi-day international celebrations.',
    description:
      'Full exclusivity across all your wedding celebrations (Mehendi, Haldi, Sangeet, Wedding, After-party). Complete peace of mind anywhere in India or across the globe.',
    features: [
      'Unlimited looks across 2 to 4 celebration days',
      'Bridal retouches between ceremonies & dinner entrance',
      'Family & entourage VIP styling coordination',
      'Climate-adaptive product formulas (humidity, alpine cold, coastal salt air)'
    ],
    duration: 'Multi-Day Bespoke',
    price: 'Custom Curated Itinerary',
    image: '/images/IMG_6748.jpg',
    featured: false,
    published: true,
    displayOrder: 5
  },
  {
    title: 'Private 1-on-1 Masterclass & Artistry Coaching',
    slug: 'private-1-on-1-masterclass',
    category: 'Education',
    tagline: 'Elevate your personal or professional artistry with hands-on bespoke mentorship.',
    description:
      'An intensive private session tailored either for individual women seeking to master their daily luxury routine or aspiring professional makeup artists mastering modern bridal techniques.',
    features: [
      'Facial architecture analysis & color theory breakdown',
      'Vanity audit: recommendations on what to keep, discard & invest in',
      'Hands-on split-face technique demonstration',
      'Curated product guidebook & luxury vendor directory'
    ],
    duration: '4 Hours Private Session',
    price: 'From ₹18,000 / $230',
    image: '/images/IMG_1923.jpg',
    featured: false,
    published: true,
    displayOrder: 6
  }
];

await Service.insertMany(serviceData);
console.log('[Seed] Created 6 services with local project photos');

// 3. Testimonials (5 testimonials using authentic project portraits)
const testimonialData = [
  {
    clientName: 'Aisha Kapoor-Singhania',
    role: 'Bride, The Oberoi Udaivilas Wedding',
    content:
      'Tejas R is an absolute visionary. On my wedding day, amidst the whirlwind of events, his calm aura and meticulous attention to detail gave me the exact radiant, dewy look I had dreamed of since childhood. My makeup stayed intact for 16 straight hours under palace lights and through emotional tears. Every guest asked who did my makeup!',
    rating: 5,
    location: 'Udaipur & London',
    eventDate: new Date('2025-11-20'),
    avatar: '/images/IMG_1925.jpg',
    featured: true,
    published: true,
    displayOrder: 1
  },
  {
    clientName: 'Rhea Sen-Gupta',
    role: 'Creative Director, Harper’s Bazaar India',
    content:
      'Having worked with makeup artists across Milan, Paris, and Mumbai, Tejas R stands in a rare league. His understanding of skin undertones, lighting refraction, and editorial balance is second to none. He transforms without masking individuality. A true master of the craft.',
    rating: 5,
    location: 'Mumbai',
    eventDate: new Date('2025-10-14'),
    avatar: '/images/IMG_2045.jpg',
    featured: true,
    published: true,
    displayOrder: 2
  },
  {
    clientName: 'Dr. Priya Malhotra',
    role: 'Bride, St. Regis Mumbai',
    content:
      'As someone who never wears heavy makeup, I was terrified of looking cakey on my big day. Tejas R listened so patiently, understood my skin sensitivities, and gave me the most ethereal glass-skin look. I felt like the most elevated, confident version of myself.',
    rating: 5,
    location: 'Mumbai & New York',
    eventDate: new Date('2025-12-08'),
    avatar: '/images/IMG_7443.jpg',
    featured: true,
    published: true,
    displayOrder: 3
  },
  {
    clientName: 'Natasha Merchant',
    role: 'Destination Bride, Villa d’Este, Lake Como',
    content:
      'Hiring Tejas R for our 3-day destination celebration in Italy was the best decision we made. From the breezy welcome party to the sunset ceremony, each look was distinctly stunning yet cohesive. His punctuality, grace, and professionalism are unmatched.',
    rating: 5,
    location: 'Lake Como, Italy',
    eventDate: new Date('2025-08-25'),
    avatar: '/images/IMG_5560.jpg',
    featured: true,
    published: true,
    displayOrder: 4
  },
  {
    clientName: 'Simran Batra',
    role: 'Bride, W Goa Sunset Celebration',
    content:
      'The Sangeet night in Goa was humid and wild, but my eye makeup and sculpted skin didn’t budge an inch even after 4 hours on the dance floor. Tejas R’s draping skills also rescued my lehenga dupatta. He goes above and beyond for his brides!',
    rating: 5,
    location: 'Goa & New Delhi',
    eventDate: new Date('2026-01-05'),
    avatar: '/images/IMG_5164.jpg',
    featured: false,
    published: true,
    displayOrder: 5
  }
];

await Testimonial.insertMany(testimonialData);
console.log('[Seed] Created 5 testimonials with local project photos');

// 4. Sample Client Bookings (5 bookings)
const bookingData = [
  {
    name: 'Kavya Singhal',
    phone: '+91 98201 11223',
    email: 'kavya.singhal@outlook.com',
    eventType: 'Bridal',
    eventDate: new Date('2026-03-24'),
    location: 'Taj Lands End, Bandra, Mumbai',
    preferredTime: 'Early Morning (06:00 AM)',
    people: 1,
    services: ['Haute Couture Bridal Artistry'],
    budget: '₹40,000 - ₹50,000',
    message: 'Looking for a warm crimson lip and timeless heritage glow for my Anand Karaj ceremony.',
    status: 'New'
  },
  {
    name: 'Ananya Deshmukh',
    phone: '+91 97654 33210',
    email: 'ananya.d@gmail.com',
    eventType: 'Reception',
    eventDate: new Date('2026-04-12'),
    location: 'JW Marriott Sahar, Mumbai',
    preferredTime: 'Afternoon (02:00 PM)',
    people: 3,
    services: ['Royal Sangeet & Reception Glamour'],
    budget: '₹60,000+',
    message: 'Need look for bride + mother of bride and sister. High-glam reception styling.',
    status: 'Contacted'
  },
  {
    name: 'Meera Nambiar',
    phone: '+91 94471 88990',
    email: 'meera.nambiar@yahoo.com',
    eventType: 'Engagement',
    eventDate: new Date('2026-05-02'),
    location: 'Leela Kovalam, Kerala',
    preferredTime: 'Sunset (04:30 PM)',
    people: 1,
    services: ['Pre-Wedding & Engagement Styling'],
    budget: '₹25,000',
    message: 'Outdoor sunset beach engagement. Need humidity-resistant soft dewy look.',
    status: 'Discussion'
  },
  {
    name: 'Tanvi Agarwal',
    phone: '+91 99300 44556',
    email: 'tanvi.agarwal@gmail.com',
    eventType: 'Bridal',
    eventDate: new Date('2026-06-18'),
    location: 'Suryagarh Palace, Jaisalmer',
    preferredTime: 'Full Day (3 Days)',
    people: 4,
    services: ['Destination Wedding Bridal Suite'],
    budget: 'Bespoke Package',
    message: '3-day royal palace wedding. Confirmed booking with advance deposit.',
    status: 'Confirmed'
  },
  {
    name: 'Zoya Merchant',
    phone: '+91 98110 55667',
    email: 'zoya@merchantcouture.com',
    eventType: 'Editorial',
    eventDate: new Date('2026-02-14'),
    location: 'Famous Studios, Mahalaxmi, Mumbai',
    preferredTime: 'Full Day (09:00 AM - 06:00 PM)',
    people: 2,
    services: ['Editorial, Fashion & Campaign Artistry'],
    budget: 'Standard Agency Day Rate',
    message: 'Spring/Summer jewellery campaign shoot. Successfully completed and paid.',
    status: 'Completed'
  }
];

await Booking.insertMany(bookingData);
console.log('[Seed] Created 5 bookings');

// 5. Before & After Transformations (3 pairs using authentic project photos)
const beforeAfterData = [
  {
    title: 'Ethereal Radiant Bridal Glow',
    category: 'Bridal',
    description:
      'Correcting hyperpigmentation with micro-thin color theory, sculpting cheek architecture, and finishing with luminous rose-gold wedding radiance.',
    beforeImage: '/images/IMG_8167.jpg',
    afterImage: '/images/IMG_8168.jpg',
    published: true,
    featured: true,
    displayOrder: 1
  },
  {
    title: 'Hollywood Evening Glam & Velvet Skin',
    category: 'Reception',
    description:
      'Elevating bare skin into flawless velvet texture with winged smoked espresso lids and sculpted satin lips for high-impact night events.',
    beforeImage: '/images/IMG_8226.jpg',
    afterImage: '/images/IMG_8227.jpg',
    published: true,
    featured: true,
    displayOrder: 2
  },
  {
    title: 'Modern Dewy Glass Finish',
    category: 'Engagement',
    description:
      'Minimal coverage, maximum skin glow. Enhancing natural facial architecture for daytime natural sunlight photography.',
    beforeImage: '/images/IMG_7743.jpg',
    afterImage: '/images/IMG_7744.jpg',
    published: true,
    featured: false,
    displayOrder: 3
  }
];

await BeforeAfter.insertMany(beforeAfterData);
console.log('[Seed] Created 3 before/after transformation pairs with local project photos');

// 6. About Profile (using authentic artist portraits)
await About.create({
  name: 'Tejas R',
  title: 'Celebrity, Bridal & Haute Couture Makeup Artist',
  tagline: 'Sculpting timeless elegance and skin-first radiance for the world’s most memorable celebrations.',
  bio:
    'Trained across premier beauty institutes with over 8 years of luxury artistry experience, Tejas R has established himself as one of India’s most sought-after bridal specialists. His signature aesthetic celebrates authentic feminine grace—creating second-skin luminosity, bespoke lash architecture, and effortless elegance.',
  paragraphs: [
    'My philosophy begins with the skin. I believe true luxury lies in restraint and precision—illuminating your finest features without ever creating a heavy, mask-like barrier. Every bride deserves to walk toward her future feeling unconditionally radiant, confident, and undeniably herself.',
    'Over the past decade, my work has traversed royal palace weddings in Rajasthan, sun-drenched estates in Lake Como, fashion weeks in Milan, and editorial covers across India. Each bridal booking is treated as an intimate bespoke commission, tailored precisely to your facial geometry, attire colorimetry, and heritage.',
    'I bring an atmosphere of calm serenity, perfectionism, and uncompromising hygiene to your wedding suite. When the lights go up and the moments are captured forever, your beauty will stand timeless.'
  ],
  experienceYears: 8,
  eventsCompleted: 750,
  clientsSatisfied: 99,
  image: '/images/IMG_1930.jpg',
  secondaryImage: '/images/IMG_2045.jpg',
  philosophy:
    'Artistry that honors the woman beneath the lehenga. Timeless, never trendy; luminous, never masked.',
  signatureStyle: 'Second-skin glass finish, sculpted micro-contour, romantic winged eyes & bespoke lash mapping.',
  certifications: [
    'London Academy of Makeup & SFX – Master Certification',
    'Couture Bridal Artistry Guild, Paris',
    'Airbrush Artistry Masterclass by Mario Dedivanovic, NYC',
    'Advanced Derm-Aesthetic Skin Preparation Specialist'
  ],
  awards: [
    'Vogue India Wedding Awards – Best Luxury Bridal Artist 2024',
    'WedMeGood Gold Standard Artistry Award 2023 & 2024',
    'Grazia Beauty Awards – Editorial Stylist of the Year Nominee',
    'Harper’s Bazaar Bride – Top 10 International Stylists to Know'
  ],
  published: true,
  featured: true,
  displayOrder: 1
});
console.log('[Seed] Created About profile with local project photo');

// 7. Site Settings (using authentic hero photography)
await SiteSettings.create({
  businessName: 'Tej Makeup Artist',
  phone: '+91 91132 32920',
  whatsapp: '+919113232920',
  whatsappMessage: 'Hi Tejas R, I would love to check your availability and package details for my wedding/event!',
  email: 'concierge@tejmakeup.com',
  instagram: 'https://www.instagram.com/tej_makeupartist?stkn=MXUxcXE1cXZua2F6Yw%3D%3D&utm_source=qr',
  address: 'Bespoke Private Studio, Bandra West, Mumbai | Available Worldwide for Destinations',
  mapsUrl: 'https://maps.google.com/?q=Bandra+West+Mumbai',
  workingHours: 'Mon – Sun: 08:00 AM – 08:00 PM (Strictly by prior appointment)',
  seoTitle: 'Tej Makeup Artist | Luxury Bridal & Haute Editorial Stylist Mumbai',
  seoDescription:
    'Exquisite luxury bridal and editorial makeup artistry by Tejas R. Luminous glass-skin transformations, heritage wedding couture, and destination styling worldwide.',
  heroHeading: 'Timeless Beauty, Sculpted with Couture Artistry',
  heroSubheading:
    'Haute couture bridal artistry and editorial elegance tailored for the most unforgettable celebrations of your life.',
  heroImage: '/images/tejas_hero.jpg'
});
console.log('[Seed] Created default Site Settings with Tejas R hero photo');

console.log('[Seed] Database seeding completed successfully with 100% local project photos!');
process.exit(0);
