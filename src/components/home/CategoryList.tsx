import React from 'react';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory?: (category: Category | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            What are you craving today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Explore handcrafted culinary categories
          </p>
        </div>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory?.(null)}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory?.(isSelected ? null : category)}
              className="flex flex-col items-center flex-shrink-0 group text-center focus:outline-none"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-200 group-hover:scale-105 ${
                  isSelected
                    ? 'ring-4 ring-brand-500 shadow-float bg-brand-50'
                    : 'ring-2 ring-slate-100 group-hover:ring-brand-300'
                }`}
              >
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full shadow-inner"
                  loading="lazy"
                />
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  isSelected ? 'text-brand-600' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
