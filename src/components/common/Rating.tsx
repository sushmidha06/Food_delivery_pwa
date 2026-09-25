import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingProps {
  rating: number;
  reviewCount?: number | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 'md',
  className,
  showText = true,
}) => {
  const isHighRating = rating >= 4.0;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-0.5 gap-1 font-bold',
    lg: 'text-sm px-2.5 py-1 gap-1.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center rounded-lg text-white font-semibold',
          isHighRating ? 'bg-emerald-600' : 'bg-amber-500',
          sizeClasses[size]
        )}
      >
        <Star className={cn('fill-current', iconSizes[size])} />
        <span>{rating.toFixed(1)}</span>
      </span>
      {reviewCount && showText && (
        <span className="text-xs text-slate-500 font-medium">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
