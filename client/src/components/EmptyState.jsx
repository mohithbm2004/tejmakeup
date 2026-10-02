import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are no records matching your current filter or criteria.',
  actionText,
  onAction
}) => {
  return (
    <div className="py-20 px-6 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-champagne-100 border border-champagne-300 flex items-center justify-center mb-5 text-champagne-600 shadow-sm">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl text-noir font-medium mb-2">{title}</h3>
      <p className="text-sand-600 text-sm leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-widest hover:bg-champagne-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
