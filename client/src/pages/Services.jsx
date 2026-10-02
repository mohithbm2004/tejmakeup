import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Sparkles, HelpCircle } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const Services = () => {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
        const cats = ['All', ...new Set(res.data.map((s) => s.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.warn('Failed to load services:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory);

  const faqs = [
    {
      q: 'Do you offer bridal makeup trials?',
      a: 'Yes, bespoke bridal preview consultations and trials are hosted exclusively at our private Bandra studio, allowing us to test skin chemistry, lighting reaction, and dress colorimetry.'
    },
    {
      q: 'Do you travel for destination weddings?',
      a: 'Absolutely. Over 60% of our weddings are destination commissions across Udaipur, Jaipur, Goa, Lake Como, the Amalfi Coast, and Southeast Asia. Full travel and suite lodging are arranged by the client.'
    },
    {
      q: 'Which luxury makeup and skincare brands do you use?',
      a: 'We use exclusively premier international luxury formulations including Augustinus Bader, Charlotte Tilbury, Tom Ford, Pat McGrath Labs, La Mer, Chanel, and Dior Beauty.'
    },
    {
      q: 'How far in advance should I secure my wedding booking?',
      a: 'Auspicious wedding dates during the peak winter wedding season (October – March) are typically reserved 6 to 12 months in advance upon signing the agreement and deposit.'
    }
  ];

  return (
    <>
      <SEO
        title="Services & Bridal Packages"
        description="Explore our bespoke bridal artistry, royal reception transformations, editorial styling, and masterclasses."
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              Haute Artistry Offerings
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal">
              Services & Experiences
            </h1>
            <p className="text-sand-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
              Every appointment is treated as an intimate artistic commission, engineered with bespoke skin infusion, facial contouring, and tranquil bridal suite hospitality.
            </p>
          </div>

          {/* Category Tabs */}
          {categories.length > 2 && (
            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center sm:justify-center gap-2 mb-12 sm:mb-16 px-4 sm:px-0 py-1 -mx-6 sm:mx-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-noir text-ivory border-noir shadow-sm font-semibold'
                      : 'bg-white/80 text-sand-700 border-sand-300 hover:border-champagne-500 hover:text-noir'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          {loading ? (
            <CardSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="No services found matching this category filter."
              actionText="View All Services"
              onAction={() => setActiveCategory('All')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((srv) => (
                <div
                  key={srv._id}
                  className="bg-white border border-sand-200/90 flex flex-col justify-between hover:border-champagne-500 hover:shadow-xl transition-all duration-400 group overflow-hidden"
                >
                  <div>
                    {/* Cover image */}
                    <div className="aspect-[16/10] overflow-hidden bg-sand-200 relative">
                      <img
                        src={
                          srv.image ||
                          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800'
                        }
                        alt={srv.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-noir/70 backdrop-blur-sm text-ivory text-[9px] uppercase tracking-widest px-2.5 py-1">
                        {srv.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4">
                      <div className="flex items-center justify-between text-xs text-sand-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-champagne-600" />
                          <span>{srv.duration}</span>
                        </span>
                        {srv.price ? (
                          <span className="font-serif text-base text-noir font-semibold">
                            {srv.price}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider text-sand-500 font-medium">
                            ENQUIRE FOR DETAILS
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl text-noir font-normal group-hover:text-champagne-700 transition-colors">
                        {srv.title}
                      </h3>

                      {srv.tagline && (
                        <p className="text-xs text-champagne-800 font-medium italic">
                          "{srv.tagline}"
                        </p>
                      )}

                      <p className="text-xs text-sand-600 leading-relaxed font-light">
                        {srv.description}
                      </p>

                      {/* Features Bullet Points */}
                      {srv.features && srv.features.length > 0 && (
                        <div className="pt-4 border-t border-sand-100 space-y-2">
                          <span className="text-[10px] uppercase tracking-ultra text-sand-400 font-semibold block">
                            What is Included
                          </span>
                          <ul className="space-y-1.5">
                            {srv.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-sand-700 leading-snug">
                                <Check className="w-3.5 h-3.5 text-champagne-600 flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="p-8 pt-0">
                    <Link
                      to={`/book?service=${encodeURIComponent(srv.title)}`}
                      className="block w-full py-3.5 text-center bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-sm"
                    >
                      ENQUIRE FOR DETAILS
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bridal FAQs */}
          <div className="mt-28 pt-16 border-t border-sand-300">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block mb-2">
                Questions & Details
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
                Frequently Inquired
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-8 bg-white border border-sand-200/80 space-y-3">
                  <h4 className="font-serif text-xl text-noir font-medium flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-champagne-600 flex-shrink-0 mt-1" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-sand-600 leading-relaxed font-light pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
