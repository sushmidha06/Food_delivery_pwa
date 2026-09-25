import React from 'react';
import { cn } from '../../utils/cn';

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-44 bg-slate-200 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-2/3" />
          <div className="h-5 bg-slate-200 rounded w-10" />
        </div>
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 bg-slate-100 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 animate-pulse">
      <div className="flex-1 space-y-2.5">
        <div className="w-4 h-4 bg-slate-200 rounded" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="w-28 h-28 bg-slate-200 rounded-xl flex-shrink-0" />
    </div>
  );
};

export const PageSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <RestaurantCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const TextSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('bg-slate-200 rounded animate-pulse', className)} />;
};
