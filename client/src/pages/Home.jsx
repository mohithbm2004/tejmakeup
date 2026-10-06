import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Calendar, Clock, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import InstagramGrid from '../components/InstagramGrid';
import { CardSkeleton, MasonrySkeleton } from '../components/LoadingSkeleton';

const Home = () => {
  const { settings } = useSettings();
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'BRIDAL',
    'ENGAGEMENT',
    'RECEPTION',
    'PARTY',
    'EDITORIAL',
    'HAIR'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes, tRes, aRes] = await Promise.all([
          api.get('/portfolio?published=true&limit=12'),
          api.get('/services?featured=true&limit=6'),
          api.get('/testimonials?featured=true&limit=3'),
          api.get('/about')
        ]);
        setPortfolio(pRes.data);
        setServices(sRes.data);
        setTestimonials(tRes.data);
        setAbout(aRes.data);
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO
        title="Luxury Bridal & Haute Editorial Artistry"
        description={settings.seoDescription}
      />

      {/* Hero Section - Haute Editorial Luxury */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 overflow-hidden bg-[#0A0A0A]">
        {/* Ambient atmospheric lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-champagne-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-champagne-400/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#0A0A0A]/90 to-[#0A0A0A]" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Couture Typography & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-7 order-2 lg:order-1"
            >
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-champagne-500/10 border border-champagne-400/25 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne-400 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-300 font-medium">
                    {settings.businessName || 'TEJ MAKEUP ARTIST'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-sand-300 font-light block">
                  BRIDAL • EDITORIAL • OCCASION
                </p>
              </div>

              <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.1rem] font-light text-ivory leading-[1.12] tracking-tight break-words">
                {settings.heroHeading || 'Timeless Beauty, Sculpted with Couture Artistry'}
              </h1>

              <p className="text-sand-300 text-xs sm:text-base lg:text-lg leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {settings.heroSubheading ||
                  'Haute couture bridal artistry and editorial elegance tailored for the most unforgettable celebrations of your life.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/book"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-champagne-600 text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:bg-champagne-500 transition-all duration-300 shadow-xl text-center"
                >
                  BOOK YOUR DATE
                </Link>
                <Link
                  to="/portfolio"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-transparent border border-ivory/30 text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:bg-ivory hover:text-noir transition-all duration-300 text-center"
                >
                  VIEW PORTFOLIO
                </Link>
              </div>

              {/* Trust & Craftsmanship Accents */}
              <div className="pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="font-serif text-lg sm:text-2xl text-champagne-300 font-light">10+</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sand-400">Years Mastery</div>
                </div>
                <div>
                  <div className="font-serif text-lg sm:text-2xl text-champagne-300 font-light">500+</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sand-400">Brides Styled</div>
                </div>
                <div>
                  <div className="font-serif text-lg sm:text-2xl text-champagne-300 font-light">Global</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sand-400">Destination Ready</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Portrait of Tejas R */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center order-1 lg:order-2"
            >
              <div className="relative w-full max-w-[260px] xs:max-w-[280px] sm:max-w-sm lg:max-w-md group">
                {/* Subtle champagne halo glow behind photo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-champagne-600/20 via-transparent to-champagne-400/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                
                {/* Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl">
                  <img
                    src={settings.heroImage || '/images/tejas_hero.jpg'}
                    alt="Tejas R - Tej Makeup Artist"
                    className="w-full h-auto aspect-[3/4] object-cover object-[center_18%] filter brightness-95 contrast-[1.02] transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Bottom Vignette / Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

                  {/* Elegant Floating Badge */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-noir/80 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-serif text-ivory tracking-wide">Tejas R</p>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-champagne-300 font-light">Founder & Master Artist</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-champagne-400" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Luxury Introduction Section */}
      <section className="py-24 bg-[#FDFBF7] border-b border-[#EBE3D5]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
            The Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-noir font-normal leading-tight">
            "Where artistry meets individuality."
          </h2>
          <div className="w-12 h-[1px] bg-champagne-500 mx-auto my-6" />
          <p className="text-sand-700 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            {about?.bio ||
              'Specializing in high-end bridal couture and fashion editorial artistry. Every look is an intimate collaboration designed around your bone structure, skin undertones, and the emotional resonance of your celebration.'}
          </p>
          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-noir hover:text-champagne-600 font-semibold group transition-colors"
            >
              <span>DISCOVER MY STORY</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Artist Ethos & Accolades Teaser */}
      <section className="py-24 bg-white border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block mb-3">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-noir font-normal leading-tight mb-6">
              "Makeup should never mask your soul; it should illuminate your innate majesty."
            </h2>
            <p className="text-sand-700 text-sm leading-relaxed mb-6 font-light">
              {about?.bio ||
                'Trained across premier beauty academies and seasoned by luxury heritage weddings across India, Tejas R crafts looks characterized by ultra-pure second-skin radiance, seamless micro-contours, and architectural eye styling.'}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-noir hover:text-champagne-600 font-medium group"
            >
              <span>Discover the Artist Journey</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-sand-50 border border-sand-200 space-y-3">
              <Award className="w-6 h-6 text-champagne-600" />
              <h3 className="font-serif text-xl text-noir font-medium">Award-Winning Artistry</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Recognized by leading fashion publications and luxury wedding forums for gold-standard bridal mastery.
              </p>
            </div>
            <div className="p-8 bg-sand-50 border border-sand-200 space-y-3">
              <ShieldCheck className="w-6 h-6 text-champagne-600" />
              <h3 className="font-serif text-xl text-noir font-medium">16-Hour 4K Endurance</h3>
              <p className="text-xs text-sand-600 leading-relaxed font-light">
                Every application is engineered with clinical skincare formulas to withstand tears, humidity, and spotlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK Section */}
      <section className="py-28 bg-[#FBF9F5] border-t border-[#EBE3D5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              PORTFOLIO HIGHLIGHTS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-noir font-normal tracking-tight">
              FEATURED WORK
            </h2>
            <p className="text-sand-600 text-sm font-light">
              A collection of bridal, occasion and editorial looks.
            </p>
          </div>

          {/* Portfolio Category Filter Buttons */}
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-3 mb-12 sm:mb-16 px-4 sm:px-0 py-1 -mx-6 sm:mx-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-noir text-ivory border border-noir shadow-sm font-semibold'
                    : 'bg-white/80 text-sand-700 border border-sand-300 hover:border-champagne-500 hover:text-noir'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <MasonrySkeleton count={6} />
          ) : (
            <>
              {/* Asymmetric / Editorial Masonry Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {portfolio
                  .filter((item) => {
                    if (selectedCategory === 'ALL') return true;
                    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
                  })
                  .slice(0, 7)
                  .map((item, idx) => {
                    // Create asymmetric visual rhythm: large anchor image on item 0, tall portrait, wide banner, etc.
                    let gridSpan = 'md:col-span-4';
                    let aspectClass = 'aspect-[3/4]';

                    if (idx === 0) {
                      gridSpan = 'md:col-span-8 md:row-span-2';
                      aspectClass = 'aspect-[4/3] md:aspect-[16/11]';
                    } else if (idx === 1) {
                      gridSpan = 'md:col-span-4';
                      aspectClass = 'aspect-[3/4]';
                    } else if (idx === 2) {
                      gridSpan = 'md:col-span-4';
                      aspectClass = 'aspect-[3/4]';
                    } else if (idx === 3) {
                      gridSpan = 'md:col-span-6';
                      aspectClass = 'aspect-[16/10]';
                    } else if (idx === 4) {
                      gridSpan = 'md:col-span-6';
                      aspectClass = 'aspect-[16/10]';
                    }

                    return (
                      <div
                        key={item._id || idx}
                        className={`${gridSpan} group relative overflow-hidden bg-sand-200 border border-[#EBE3D5] shadow-sm`}
                      >
                        <Link to={`/portfolio/${item.slug}`} className="block relative overflow-hidden w-full h-full">
                          <img
                            src={item.coverImage || item.images?.[0]?.url}
                            alt={item.title}
                            className={`w-full h-full object-cover object-[center_20%] face-align transition-transform duration-700 ease-out group-hover:scale-105 ${aspectClass}`}
                            loading="lazy"
                          />
                          {/* Subtle dark overlay with category and title reveal on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6 text-ivory">
                            <span className="text-[10px] uppercase tracking-ultra text-champagne-300 font-semibold mb-1">
                              {item.category} • {item.location || 'Bespoke Look'}
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                              {item.title}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-champagne-400 mt-2 font-medium">
                              View Editorial <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>

              <div className="text-center mt-14">
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-noir hover:text-champagne-600 font-semibold group transition-colors"
                >
                  <span>VIEW FULL PORTFOLIO GALLERY</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Signature Services Teaser */}
      <section className="py-28 bg-white border-t border-[#EBE3D5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              BESPOKE ARTISTRY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-noir font-normal">
              SERVICES
            </h2>
            <p className="text-sand-600 text-xs sm:text-sm font-light">
              Bridal, engagement, reception, and couture occasion makeup services tailored with uncompromising precision.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv, idx) => (
                <div
                  key={srv._id || idx}
                  className="bg-[#FDFBF7] border border-[#EBE3D5] flex flex-col justify-between p-8 hover:border-champagne-500 transition-all duration-300 shadow-sm group"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/10] overflow-hidden bg-sand-200 mb-6">
                      <img
                        src={srv.image || '/images/IMG_1466.jpg'}
                        alt={srv.title}
                        className="w-full h-full object-cover object-[center_20%] face-align transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-champagne-700">
                      <span className="uppercase tracking-widest font-semibold">{srv.category}</span>
                      <span className="text-sand-600">{srv.duration}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-noir font-normal">{srv.title}</h3>
                    <p className="text-sand-600 text-xs leading-relaxed font-light line-clamp-3">
                      {srv.description}
                    </p>
                    {srv.price && (
                      <p className="font-serif text-lg text-noir font-medium pt-2 border-t border-sand-200">
                        {srv.price}
                      </p>
                    )}
                  </div>
                  <div className="pt-6">
                    <Link
                      to={`/book?service=${encodeURIComponent(srv.title)}`}
                      className="block w-full py-3 text-center bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors"
                    >
                      ENQUIRE FOR DETAILS
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-noir hover:text-champagne-600 font-semibold"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* Minimal Luxury Testimonials */}
      <section className="py-28 bg-white border-t border-[#EBE3D5]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              WORDS FROM OUR BRIDES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-noir font-normal">
              TESTIMONIALS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={t._id || idx}
                className="bg-[#FDFBF7] border border-[#EBE3D5] p-8 flex flex-col justify-between relative shadow-sm"
              >
                <div>
                  <div className="text-champagne-600 text-sm tracking-widest mb-4">
                    ★★★★★
                  </div>
                  <p className="text-sand-700 text-sm leading-relaxed italic font-light mb-6">
                    "{t.content}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EBE3D5]">
                  <h4 className="font-serif text-base text-noir font-medium">— {t.clientName}</h4>
                  <p className="text-[10px] text-sand-500 uppercase tracking-wider mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-noir hover:text-champagne-600 font-semibold"
            >
              <span>READ ALL TESTIMONIALS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram-Style Grid */}
      <InstagramGrid items={portfolio} />

      {/* BOOKING CTA: Full-width Luxury Image Banner */}
      <section className="relative py-32 bg-[#0D0D0D] text-ivory text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={
              settings.heroImage ||
              '/images/IMG_1465.jpg'
            }
            alt="Luxury Bridal Booking"
            className="w-full h-full object-cover object-[center_20%] face-align opacity-25 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/90" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-ivory font-light leading-tight tracking-tight uppercase">
            YOUR DATE.<br />YOUR LOOK.<br />YOUR MOMENT.
          </h2>
          <p className="text-sand-300 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Let's create something beautiful.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="px-9 py-4 bg-champagne-600 text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:bg-champagne-500 transition-all duration-300 shadow-xl"
            >
              BOOK YOUR DATE
            </Link>
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  settings.whatsappMessage || 'Hello, I would like to check availability for my wedding date.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-9 py-4 border border-sand-400 text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:border-champagne-400 hover:text-champagne-400 transition-colors"
              >
                WHATSAPP CONCIERGE
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
