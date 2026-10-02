import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/60 border border-sand-200/80 rounded-none overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-sand-200/50 w-full" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-sand-200/60 rounded w-1/3" />
            <div className="h-6 bg-sand-200/80 rounded w-3/4" />
            <div className="h-3 bg-sand-200/40 rounded w-full" />
            <div className="h-3 bg-sand-200/40 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MasonrySkeleton = ({ count = 6 }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {Array.from({ length: count }).map((_, i) => {
        const heights = ['h-64', 'h-96', 'h-80', 'h-72', 'h-[420px]'];
        const h = heights[i % heights.length];
        return (
          <div key={i} className={`w-full ${h} bg-sand-200/60 animate-pulse border border-sand-200/50 break-inside-avoid`} />
        );
      })}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-white/50 border border-sand-200/50 animate-pulse flex items-center px-6 gap-4">
          <div className="h-4 bg-sand-200 rounded w-1/4" />
          <div className="h-4 bg-sand-200 rounded w-1/4" />
          <div className="h-4 bg-sand-200 rounded w-1/4" />
          <div className="h-4 bg-sand-200 rounded w-1/6 ml-auto" />
        </div>
      ))}
    </div>
  );
};

export default { CardSkeleton, MasonrySkeleton, TableSkeleton };
