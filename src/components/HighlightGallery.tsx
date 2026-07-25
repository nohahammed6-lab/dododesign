import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const HighlightGallery: React.FC = () => {
  const { lang, products, searchQuery } = useApp();

  const filteredProducts = products.filter((p) => {
    return (
      searchQuery.trim() === '' ||
      p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section id="featured-grid" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-serif-ar tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'معرض الأزيـاء الموحد' : 'Unified Fashion Collection'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-en font-bold text-[#f5f0e6] mb-4">
          {lang === 'ar' ? 'جميع المنتجات (تشكيلة دودو ديزاين)' : 'Dodo Design All Products'}
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-4"></div>
        <p className="text-xs sm:text-sm text-[#a8a08f] font-light">
          {lang === 'ar'
            ? 'تصفحي المجموعة الكاملة في مكان واحد مع التقييمات الشفافة والمقاسات المتاحة لكل قطعة.'
            : 'Explore all designs in one place with customer ratings and available size selection.'}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121115] rounded-xl border border-[#2a261f]">
          <p className="text-[#a8a08f] font-serif-ar text-base">
            {lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة لعملية البحث.' : 'No items match your search.'}
          </p>
        </div>
      )}
    </section>
  );
};
