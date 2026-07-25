import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Sparkles, Star, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  const { lang, setViewMode, setActiveCategory } = useApp();

  const handleGoToCatalog = () => {
    setActiveCategory('all');
    setViewMode('store');
    const el = document.getElementById('featured-grid');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="bento-collections" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 border-b border-[#26231c] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-serif-ar tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تشكيلة دودو ديزاين' : 'Dodo Design Collection'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-en font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'المعرض الموحد لجميع الأزيـاء' : 'Unified Fashion Catalogue'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a08f] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
          {lang === 'ar'
            ? 'تصفحي جميع ابتكارات دودو ديزاين في مكان واحد، مع إمكانية اختيار المقاس الدقيق والكمية المتاحة لكل قطعة.'
            : 'Explore all creations in a single unified collection with full size selection and live stock availability.'}
        </p>
      </div>

      {/* Simplified Unified Showcase Hero */}
      <div 
        onClick={handleGoToCatalog}
        className="group relative min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden cursor-pointer border border-[#2a261e] hover:border-[#d4af37] transition-all duration-500 shadow-2xl"
      >
        <img
          src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=80"
          alt="Dodo Design Unified Collection"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/50 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 right-8 text-left rtl:text-right">
          <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold mb-3">
            <Star className="w-4 h-4 fill-[#d4af37]" />
            <span>{lang === 'ar' ? 'تشكيلة شاملة • تقييم 4.9/5' : 'Complete Collection • 4.9/5 Rated'}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif-en font-bold text-[#f5eee0] mb-3 group-hover:text-[#d4af37] transition">
            {lang === 'ar' ? 'جميع منتجات دودو ديزاين بين يديك' : 'Explore The Entire Dodo Design Collection'}
          </h3>
          <p className="text-xs sm:text-sm text-[#c4bbb0] max-w-2xl mb-6 font-light">
            {lang === 'ar'
              ? 'تشكيلة راقية ومبسطة تضم أحدث التصاميم المصنوعة يدويًا بأعلى معايير الخياطة الفاخرة.'
              : 'Browse all exclusive designs in one simplified, streamlined experience.'}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg group-hover:scale-105 transition">
            <span>{lang === 'ar' ? 'استعرضي المنتجات الآن' : 'View Full Catalogue'}</span>
            {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </section>
  );
};
