import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 bg-ivory-100 px-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block">
            404 Error
          </span>
          <h1 className="font-serif text-6xl sm:text-7xl font-light text-noir">
            Page Not Found
          </h1>
          <p className="text-sand-600 text-xs sm:text-sm font-light leading-relaxed">
            The page you are looking for does not exist or has been relocated within the atelier.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors"
            >
              Return Home
            </Link>
            <Link
              to="/portfolio"
              className="w-full sm:w-auto px-8 py-3.5 border border-sand-300 bg-white text-noir text-xs uppercase tracking-widest font-medium hover:border-champagne-500 hover:text-champagne-600 transition-colors"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
