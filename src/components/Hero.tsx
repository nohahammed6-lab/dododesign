import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const { lang, setActiveCategory, setViewMode } = useApp();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#2a261e]">
      {/* Editorial Background Image with Obsidian Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
          alt="Dodo Design Winter Couture 2024"
          className="w-full h-full object-cover object-center filter brightness-[0.4] scale-105 transform transition duration-1000 ease-out hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0b0b0d]/50 to-[#0b0b0d]"></div>
      </div>

      {/* Decorative Gold Frame Corner Lines */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#d4af37]/40 pointer-events-none hidden sm:block"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#d4af37]/40 pointer-events-none hidden sm:block"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#d4af37]/40 pointer-events-none hidden sm:block"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#d4af37]/40 pointer-events-none hidden sm:block"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 py-16">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181612]/80 border border-[#d4af37]/40 text-[#f0dfb3] text-xs font-serif-ar tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: '6s' }} />
          <span>{lang === 'ar' ? 'تشكيلة أزياء دودو ديزاين 2026' : 'Dodo Design Exclusive Collection'}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-en font-bold tracking-tight text-[#f3eee2] leading-tight mb-4">
          <span className="block text-gold-gradient drop-shadow-lg">
            DODO DESIGN
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl font-serif-ar font-light text-[#ded6c5] mt-2">
            {lang === 'ar' ? 'سحر الظلام، بلمسة من الذهب' : 'The Glamour of Darkness, Touched by Gold'}
          </span>
        </h1>

        {/* Subtitle / Manifesto */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#b8b09d] font-light leading-relaxed mb-10">
          {lang === 'ar'
            ? 'تصاميم فاخرة تعيد صياغة أزياء الهوت كوتور العربية برؤية معمارية ناعمة، خيوط الحرير الخالص والتطريز المذهب الفاخر.'
            : 'Unveiling architectural elegance handcrafted with mulberry silk and 24k gold leaf embroidery for the modern haute couture icon.'}
        </p>

        {/* Centered Main Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              setViewMode('store');
              setActiveCategory('all');
              const el = document.getElementById('featured-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-sm sm:text-base tracking-widest uppercase rounded-lg shadow-2xl hover:brightness-110 hover:shadow-[#d4af37]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border border-[#fff2c2]/50"
          >
            <span>{lang === 'ar' ? 'اكتشفي المجموعة' : 'Discover Collection'}</span>
            {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={() => {
          const el = document.getElementById('featured-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#c2b69d] hover:text-[#d4af37] flex flex-col items-center gap-1 text-xs tracking-widest opacity-80 hover:opacity-100 transition animate-bounce cursor-pointer"
      >
        <span>{lang === 'ar' ? 'اكتشفي المجموعة' : 'DISCOVER'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </section>
  );
};
