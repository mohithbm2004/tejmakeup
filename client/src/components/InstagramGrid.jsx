import React from 'react';
import { Instagram, ExternalLink, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const InstagramGrid = ({ items = [] }) => {
  const { settings } = useSettings();

  const defaultPhotos = [
    '/images/IMG_1465.jpg',
    '/images/IMG_1466.jpg',
    '/images/IMG_1922.jpg',
    '/images/IMG_1923.jpg',
    '/images/IMG_1925.jpg',
    '/images/IMG_1930.jpg'
  ];

  // Extract photos from portfolio or use local project defaults
  const photos = (items.length > 0 ? items.slice(0, 6) : defaultPhotos.map((url, idx) => ({ _id: idx, coverImage: url, title: 'Tej Makeup Artist Portfolio', category: 'Bridal' }))).map((item, idx) => ({
    id: item._id || idx,
    url: item.coverImage || item.images?.[0]?.url || defaultPhotos[idx % defaultPhotos.length],
    title: item.title,
    category: item.category
  }));

  const rawHandle = settings.instagram
    ? settings.instagram.split('/').filter(Boolean).pop()?.split('?')[0] || 'tej_makeupartist'
    : 'tej_makeupartist';
  const instagramHandle = rawHandle.replace('@', '');

  return (
    <section className="py-24 bg-[#FAF7F2] border-t border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-12 space-y-3">
        <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
          INSTAGRAM FEED
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-noir font-normal">
          FOLLOW THE ARTISTRY
        </h2>
        <p className="text-sm font-light text-sand-600">
          @{instagramHandle}
        </p>
        <div className="pt-2">
          <a
            href={settings.instagram || `https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-champagne-600 transition-colors shadow-sm"
          >
            <Instagram className="w-3.5 h-3.5 text-champagne-400" />
            <span>FOLLOW ON INSTAGRAM</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 px-3 md:px-6 max-w-[1600px] mx-auto">
        {photos.map((photo, i) => (
          <a
            key={photo.id || i}
            href={settings.instagram || '#'}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-sand-200 block"
          >
            <img
              src={photo.url}
              alt={photo.title || 'Instagram bridal post'}
              className="w-full h-full object-cover object-[center_20%] face-align transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Dark editorial overlay */}
            <div className="absolute inset-0 bg-noir/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-ivory">
              <Instagram className="w-6 h-6 text-champagne-300 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
              <p className="text-[11px] font-serif line-clamp-2">{photo.title}</p>
              <span className="text-[9px] uppercase tracking-widest text-champagne-300 mt-1">
                {photo.category}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramGrid;
