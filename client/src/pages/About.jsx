import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Sparkles, HeartHandshake } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/LoadingSkeleton';

const About = () => {
  const { settings } = useSettings();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        setAbout(res.data);
      } catch (err) {
        console.warn('Failed to load about data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <>
      <SEO
        title="About the Artist"
        description={about?.tagline || 'Discover the journey and artistic ethos behind Tej Makeup Artist.'}
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              The Atelier & Visionary
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal">
              {about?.name || 'Tejas R'}
            </h1>
            <p className="text-sand-600 text-sm font-light uppercase tracking-wider">
              {about?.title || 'Master Bridal & Haute Editorial Makeup Artist'}
            </p>
          </div>

          {/* Main Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
            {/* Left Image & Stats */}
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[3/4] overflow-hidden bg-sand-200 border border-sand-300 shadow-xl relative">
                <img
                  src={
                    about?.image ||
                    '/images/IMG_1930.jpg'
                  }
                  alt={about?.name || 'Tejas R'}
                  className="w-full h-full object-cover object-[center_20%] face-align"
                />
              </div>

              {/* Numerical Highlights */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-sand-50 border border-sand-200 text-center">
                <div>
                  <p className="font-serif text-3xl text-noir font-normal">{about?.experienceYears || 8}+</p>
                  <p className="text-[10px] uppercase tracking-wider text-sand-600 mt-1">Years at Helm</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-noir font-normal">{about?.eventsCompleted || 750}+</p>
                  <p className="text-[10px] uppercase tracking-wider text-sand-600 mt-1">Brides Styled</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-noir font-normal">{about?.clientsSatisfied || 99}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-sand-600 mt-1">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Story & Philosophy */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl text-noir font-normal">
                  "True luxury in makeup is never excessive—it is deeply intentional, respectful of anatomy, and radiantly pure."
                </h2>
                <p className="text-sand-700 text-sm sm:text-base leading-relaxed font-light">
                  {about?.bio ||
                    'With a career that started at prestigious beauty institutes and refined across editorial runways and luxury weddings, Tejas R has emerged as the premier choice for brides who seek timeless royalty.'}
                </p>
              </div>

              {/* Story Paragraphs */}
              {about?.paragraphs && about.paragraphs.length > 0 && (
                <div className="space-y-4 text-sand-700 text-sm leading-relaxed font-light">
                  {about.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {/* Signature Style & Philosophy Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {about?.signatureStyle && (
                  <div className="p-6 bg-white border border-sand-200">
                    <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block mb-2">
                      Signature Style
                    </span>
                    <p className="text-xs text-sand-700 leading-relaxed font-light">
                      {about.signatureStyle}
                    </p>
                  </div>
                )}
                {about?.philosophy && (
                  <div className="p-6 bg-white border border-sand-200">
                    <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block mb-2">
                      Skin-First Philosophy
                    </span>
                    <p className="text-xs text-sand-700 leading-relaxed font-light">
                      {about.philosophy}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link
                  to="/book"
                  className="inline-block px-8 py-4 bg-noir text-ivory text-xs uppercase tracking-ultra font-medium hover:bg-champagne-600 transition-colors shadow-sm"
                >
                  Request a Private Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* Certifications & Awards Section */}
          <div className="pt-16 border-t border-sand-300 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Certifications */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-noir font-normal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-champagne-600" />
                <span>Credentials & Ateliers</span>
              </h3>
              <ul className="space-y-3">
                {(about?.certifications || [
                  'London Academy of Makeup & SFX – Master Certification',
                  'Couture Bridal Artistry Guild, Paris',
                  'Airbrush Artistry Masterclass by Mario Dedivanovic, NYC',
                  'Advanced Derm-Aesthetic Skin Preparation Specialist'
                ]).map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-sand-700">
                    <CheckCircle2 className="w-4 h-4 text-champagne-600 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards & Press */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-noir font-normal flex items-center gap-2">
                <Award className="w-5 h-5 text-champagne-600" />
                <span>Honors & Industry Acclaim</span>
              </h3>
              <ul className="space-y-3">
                {(about?.awards || [
                  'Vogue India Wedding Awards – Best Luxury Bridal Artist 2024',
                  'WedMeGood Gold Standard Artistry Award 2023 & 2024',
                  'Grazia Beauty Awards – Editorial Stylist of the Year Nominee',
                  'Harper’s Bazaar Bride – Top 10 International Stylists to Know'
                ]).map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-sand-700">
                    <Award className="w-4 h-4 text-champagne-600 flex-shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
