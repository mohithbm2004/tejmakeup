import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, X, ExternalLink, Sparkles } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/SEO';
import { MasonrySkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio');
        setItems(res.data);
        const cats = ['All', ...new Set(res.data.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.warn('Failed to load portfolio items:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((p) => p.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextLightbox();
      else prevLightbox();
    }
  };

  const currentLightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <SEO
        title="Portfolio Gallery"
        description="Explore the haute couture bridal portfolio, editorial lookbooks, and red carpet transformations by Tejas R."
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              LOOKBOOK & ARCHIVE
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal tracking-tight">
              PORTFOLIO
            </h1>
            <p className="text-sand-600 text-sm font-light max-w-xl mx-auto leading-relaxed">
              "An editorial collection of beauty, bridal and occasion looks."
            </p>
          </div>

          {/* Filter Pills */}
          {categories.length > 1 && (
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

          {/* Masonry Grid */}
          {loading ? (
            <MasonrySkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No works found"
              description="There are currently no items under this category."
              actionText="View All Works"
              onAction={() => setActiveCategory('All')}
            />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="break-inside-avoid group relative overflow-hidden bg-sand-200 border border-sand-300 shadow-sm"
                >
                  <img
                    src={item.coverImage || item.images?.[0]?.url}
                    alt={item.title}
                    className="w-full object-cover object-[center_20%] face-align transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                    loading="lazy"
                    onClick={() => setLightboxIndex(idx)}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-ivory pointer-events-none">
                    <span className="text-[10px] uppercase tracking-ultra text-champagne-300 font-medium">
                      {item.category} {item.location ? `• ${item.location}` : ''}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl mt-1 text-white font-normal">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-sand-300 line-clamp-2 mt-1.5 font-light">
                        {item.description}
                      </p>
                    )}

                    {/* Actions on hover */}
                    <div className="pt-4 flex items-center gap-4 pointer-events-auto">
                      <button
                        onClick={() => setLightboxIndex(idx)}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-champagne-300 hover:text-white font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                      <Link
                        to={`/portfolio/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-sand-300 hover:text-champagne-400 font-medium"
                      >
                        <span>Full Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Swipe Support */}
      {currentLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-noir/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-ivory/70 hover:text-ivory p-2 focus:outline-none z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory p-3 rounded-full hover:bg-white/10 transition-colors z-50 focus:outline-none"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextLightbox}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory p-3 rounded-full hover:bg-white/10 transition-colors z-50 focus:outline-none"
            aria-label="Next Image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Center Content */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center text-center">
            <img
              src={currentLightboxItem.coverImage || currentLightboxItem.images?.[0]?.url}
              alt={currentLightboxItem.title}
              className="max-h-[68vh] max-w-full object-contain shadow-2xl border border-sand-700/50 mb-4"
            />
            <div className="space-y-1 text-ivory">
              <span className="text-[10px] uppercase tracking-ultra text-champagne-400">
                {currentLightboxItem.category} • {lightboxIndex + 1} of {filtered.length}
              </span>
              <h3 className="font-serif text-2xl font-light">{currentLightboxItem.title}</h3>
              <p className="text-xs text-sand-400 max-w-md mx-auto line-clamp-2">
                {currentLightboxItem.description}
              </p>
              <div className="pt-2">
                <Link
                  to={`/portfolio/${currentLightboxItem.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-champagne-400 hover:text-champagne-300 font-semibold"
                >
                  <span>Explore Look Gallery & Breakdown</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;
