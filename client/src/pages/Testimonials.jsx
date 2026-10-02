import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, Heart } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/LoadingSkeleton';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        setTestimonials(res.data);
      } catch (err) {
        console.warn('Failed to load testimonials:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <>
      <SEO
        title="Client Testimonials & Bride Stories"
        description="Read heartfelt reviews and testimonials from our royal brides, editorial directors, and destination wedding clients."
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              Kind Words & Stories
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal">
              Client Love & Endorsements
            </h1>
            <p className="text-sand-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
              Nothing honors our atelier more than the radiant words of brides who trusted us with their once-in-a-lifetime moments.
            </p>
          </div>

          {loading ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={t._id || idx}
                  className="bg-white border border-sand-200 p-8 flex flex-col justify-between hover:border-champagne-400 hover:shadow-lg transition-all duration-300 relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-champagne-500">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-champagne-500" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-sand-300 stroke-[1.2]" />
                    </div>

                    <p className="text-sand-700 text-xs sm:text-sm leading-relaxed italic font-light mb-6">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.clientName}
                        className="w-11 h-11 rounded-full object-cover border border-champagne-400"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-champagne-100 text-champagne-700 font-serif font-semibold flex items-center justify-center border border-champagne-300">
                        {t.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-lg text-noir font-medium leading-snug">
                        {t.clientName}
                      </h4>
                      <p className="text-[10px] text-champagne-700 uppercase tracking-wider font-medium">
                        {t.role}
                      </p>
                      {t.location && (
                        <p className="text-[10px] text-sand-500">{t.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-20 p-12 bg-sand-50 border border-sand-300 text-center max-w-3xl mx-auto space-y-4">
            <h3 className="font-serif text-3xl text-noir font-normal">
              Experience the Tej Artistry Touch
            </h3>
            <p className="text-sand-600 text-xs leading-relaxed max-w-lg mx-auto font-light">
              We look forward to writing a beautiful story together on your wedding day.
            </p>
            <div className="pt-2">
              <Link
                to="/book"
                className="inline-block px-8 py-4 bg-noir text-ivory text-xs uppercase tracking-ultra font-medium hover:bg-champagne-600 transition-colors shadow-sm"
              >
                Inquire For Your Date
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
