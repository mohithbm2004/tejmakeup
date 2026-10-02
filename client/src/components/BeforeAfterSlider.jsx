import React, { useState, useEffect, useRef } from 'react';
import { ChevronsLeftRight, Sparkles } from 'lucide-react';
import api from '../api/axios';

const BeforeAfterSlider = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!initialItems) {
      const fetchBA = async () => {
        try {
          const res = await api.get('/before-after');
          setItems(res.data);
        } catch (err) {
          console.warn('Failed to load before/after transformations:', err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBA();
    }
  }, [initialItems]);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[480px] bg-sand-200/50 animate-pulse border border-sand-300" />
    );
  }

  if (!items || items.length === 0) return null;

  const current = items[activeIndex];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Transformation Selector Tabs */}
      {items.length > 1 && (
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2 py-1">
          {items.map((it, idx) => (
            <button
              key={it._id || idx}
              onClick={() => {
                setActiveIndex(idx);
                setSliderPosition(50);
              }}
              className={`flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 border ${
                activeIndex === idx
                  ? 'bg-noir text-ivory border-noir shadow-sm font-semibold'
                  : 'bg-white/80 text-sand-700 border-sand-300 hover:border-champagne-500 hover:text-noir'
              }`}
            >
              {it.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Slider Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden select-none cursor-ew-resize border border-sand-300 shadow-xl bg-sand-100 touch-none"
      >
        {/* AFTER Image (Full background) */}
        <img
          src={current.afterImage}
          alt={`After transformation - ${current.title}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-noir/70 backdrop-blur-md text-ivory text-[9px] sm:text-[10px] uppercase tracking-widest px-2.5 sm:px-3 py-1 font-medium pointer-events-none border border-champagne-500/30">
          Couture Glow (After)
        </div>

        {/* BEFORE Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={current.beforeImage}
            alt={`Before transformation - ${current.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-noir/70 backdrop-blur-md text-ivory text-[9px] sm:text-[10px] uppercase tracking-widest px-2.5 sm:px-3 py-1 font-medium pointer-events-none border border-sand-400/30">
            Natural Canvas (Before)
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-2xl pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-ivory border-2 border-champagne-500 text-noir shadow-2xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform pointer-events-auto touch-none"
          >
            <ChevronsLeftRight className="w-4 h-4 text-champagne-700" />
          </div>
        </div>
      </div>

      {/* Description caption */}
      <div className="mt-4 text-center max-w-2xl mx-auto px-4">
        <h4 className="font-serif text-xl text-noir font-medium">{current.title}</h4>
        {current.description && (
          <p className="text-xs text-sand-600 mt-1 leading-relaxed">{current.description}</p>
        )}
        <p className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold mt-2">
          ← Drag handle to reveal transformation →
        </p>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
