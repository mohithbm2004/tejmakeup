import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/SEO';
import ErrorState from '../components/ErrorState';

const PortfolioDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/portfolio/${slug}`);
        setItem(res.data);
        setActiveImageIndex(0);
      } catch (err) {
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-6xl mx-auto px-6 animate-pulse space-y-8">
        <div className="h-6 bg-sand-200 w-1/4 rounded" />
        <div className="h-12 bg-sand-200 w-3/4 rounded" />
        <div className="aspect-[16/9] bg-sand-200 w-full" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="pt-36 pb-24 max-w-lg mx-auto px-6 text-center">
        <ErrorState
          title="Project Not Found"
          message="The portfolio look you are trying to view might have been archived or moved."
          onRetry={() => navigate('/portfolio')}
        />
      </div>
    );
  }

  const allImages = item.images && item.images.length > 0 ? item.images : [{ url: item.coverImage, alt: item.title }];
  const currentImg = allImages[activeImageIndex] || allImages[0];

  return (
    <>
      <SEO
        title={item.title}
        description={item.description}
        image={item.coverImage || currentImg?.url}
      />

      <article className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Back link */}
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sand-600 hover:text-champagne-600 transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bridal Gallery</span>
          </Link>

          {/* Heading info */}
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="flex items-center gap-3 text-xs text-champagne-700 uppercase tracking-ultra font-semibold">
              <span>{item.category}</span>
              {item.location && <span>• {item.location}</span>}
              {item.eventDate && (
                <span>• {new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-noir font-normal leading-tight">
              {item.title}
            </h1>
            {item.description && (
              <p className="text-sand-700 text-sm sm:text-base font-light leading-relaxed pt-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Main Hero Image */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden bg-sand-200 border border-sand-300 shadow-2xl mb-6 group cursor-zoom-in">
            <img
              src={currentImg.url}
              alt={currentImg.alt || item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              onClick={() => setLightboxOpen(true)}
            />
            <div
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-noir/70 backdrop-blur-sm text-ivory text-[10px] uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              Click to Enlarge
            </div>
          </div>

          {/* Multiple Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-16">
              {allImages.map((img, i) => (
                <button
                  key={img.publicId || i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square overflow-hidden bg-sand-200 border-2 transition-all ${
                    activeImageIndex === i
                      ? 'border-champagne-600 scale-95 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Book this look CTA box */}
          <div className="my-16 p-8 md:p-12 bg-white border border-champagne-300/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block mb-1">
                Bespoke Bridal Inquiries
              </span>
              <h3 className="font-serif text-2xl text-noir font-normal">
                Envisioning a similar look for your wedding?
              </h3>
              <p className="text-sand-600 text-xs mt-1 font-light">
                Consult with Tej to customize this palette and architecture to your facial contour and wedding attire.
              </p>
            </div>
            <Link
              to={`/book?look=${encodeURIComponent(item.title)}`}
              className="px-8 py-4 bg-noir text-ivory text-xs uppercase tracking-ultra font-medium hover:bg-champagne-600 transition-colors whitespace-nowrap shadow-md"
            >
              Inquire About this Look
            </Link>
          </div>

          {/* Previous & Next Project Navigation */}
          <div className="pt-12 border-t border-sand-300 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {item.prev ? (
              <Link
                to={`/portfolio/${item.prev.slug}`}
                className="p-6 bg-sand-50 border border-sand-200/90 hover:border-champagne-500 transition-all flex items-center gap-4 group"
              >
                {item.prev.coverImage && (
                  <img
                    src={item.prev.coverImage}
                    alt={item.prev.title}
                    className="w-14 h-14 object-cover border border-sand-300 flex-shrink-0"
                  />
                )}
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-sand-500 flex items-center gap-1 group-hover:text-champagne-600 font-semibold">
                    <ArrowLeft className="w-3 h-3" /> PREVIOUS WORK
                  </span>
                  <h4 className="font-serif text-lg text-noir font-medium line-clamp-1 mt-0.5">
                    {item.prev.title}
                  </h4>
                </div>
              </Link>
            ) : <div />}

            {item.next ? (
              <Link
                to={`/portfolio/${item.next.slug}`}
                className="p-6 bg-sand-50 border border-sand-200/90 hover:border-champagne-500 transition-all flex items-center justify-end text-right gap-4 group sm:col-start-2"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-sand-500 flex items-center justify-end gap-1 group-hover:text-champagne-600 font-semibold">
                    NEXT WORK <ArrowRight className="w-3 h-3" />
                  </span>
                  <h4 className="font-serif text-lg text-noir font-medium line-clamp-1 mt-0.5">
                    {item.next.title}
                  </h4>
                </div>
                {item.next.coverImage && (
                  <img
                    src={item.next.coverImage}
                    alt={item.next.title}
                    className="w-14 h-14 object-cover border border-sand-300 flex-shrink-0"
                  />
                )}
              </Link>
            ) : null}
          </div>
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-noir/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-ivory/70 hover:text-ivory p-2 focus:outline-none z-50"
          >
            <X className="w-7 h-7" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory p-3 z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % allImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory p-3 z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={currentImg.url}
              alt={currentImg.alt || item.title}
              className="max-h-[80vh] max-w-full object-contain shadow-2xl"
            />
            <p className="text-sand-400 text-xs mt-3 uppercase tracking-widest">
              Image {activeImageIndex + 1} of {allImages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioDetail;
