import React, { useState, useEffect } from 'react';
import { Instagram, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingInstagram: React.FC = () => {
  const { lang, siteSettings } = useApp();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handle = siteSettings?.instagramHandle || 'dodoo__designs';
  const url = siteSettings?.instagramUrl || 'https://www.instagram.com/dodoo__designs';

  return (
    <aside aria-label="Instagram Social Link" className="fixed bottom-6 start-6 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-[0_10px_30px_rgba(225,48,108,0.45)] hover:shadow-[0_15px_40px_rgba(225,48,108,0.7)] border-2 border-[#ffe89c]/80 transition-all duration-300 ease-out cursor-pointer ${
          isScrolling ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1 hover:scale-105'
        }`}
        title={lang === 'ar' ? `متابعتنا على إنستجرام @${handle}` : `Follow us on Instagram @${handle}`}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffd700] border border-black/40"></span>
        </span>

        {/* Instagram Icon */}
        <div className={`p-1.5 rounded-full bg-black/20 backdrop-blur-sm transition-transform duration-300 ${isScrolling ? 'rotate-12 scale-110' : 'group-hover:rotate-12'}`}>
          <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Text Badge */}
        <div className="flex flex-col pe-1 text-start">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/90 leading-tight flex items-center gap-1">
            <span>{lang === 'ar' ? 'تابعونا على إنستجرام' : 'Follow Us'}</span>
            <Sparkles className="w-2.5 h-2.5 text-[#ffd700] animate-pulse" />
          </span>
          <span className="text-[11px] sm:text-xs font-black text-white tracking-wider font-mono">
            @{handle}
          </span>
        </div>
      </a>
    </aside>
  );
};
