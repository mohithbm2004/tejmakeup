import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'Unable to load content at this moment. Please check your connection or try again.',
  onRetry
}) => {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600">
        <AlertCircle className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl text-noir font-medium mb-2">{title}</h3>
      <p className="text-sand-600 text-sm leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-noir text-ivory text-xs uppercase tracking-widest hover:bg-champagne-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
