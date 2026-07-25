import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    lang,
    products,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    openProductDetail,
    formatPrice
  } = useApp();

  if (!isSearchOpen) return null;

  const searchResults = searchQuery.trim() === ''
    ? products.slice(0, 4)
    : products.filter((p) =>
        p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-start pt-20 px-4">
      <div className="w-full max-w-3xl bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl overflow-hidden">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#23201a] flex items-center gap-3 bg-[#131217]">
          <Search className="w-5 h-5 text-[#d4af37]" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحثي عن فستان، عباءة، أو كلتش مذهب...' : 'Search for gowns, abayas, or gold clutches...'}
            className="flex-1 bg-transparent border-none text-sm text-[#f0e8d8] placeholder-[#7d7567] focus:outline-none"
          />
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="p-1 text-[#8c8271] hover:text-[#d4af37] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8c8271] mb-2 font-serif-ar">
            <span>
              {searchQuery.trim() === ''
                ? (lang === 'ar' ? 'القطع المقترحة كوتور' : 'Featured Suggestions')
                : (lang === 'ar' ? `نتائج البحث (${searchResults.length})` : `Results (${searchResults.length})`)}
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((p) => {
                const title = lang === 'ar' ? p.titleAr : p.titleEn;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openProductDetail(p.id);
                    }}
                    className="flex items-center gap-3 p-3 bg-[#141318] hover:bg-[#1a1820] border border-[#26221c] hover:border-[#d4af37]/60 rounded-lg cursor-pointer transition"
                  >
                    <img src={p.images[0]} alt={title} className="w-14 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif-ar font-semibold text-[#f0e8d8] truncate">{title}</h4>
                      <p className="text-[10px] text-[#8c8271] mt-0.5">{lang === 'ar' ? p.categoryNameAr : p.categoryNameEn}</p>
                      <span className="text-xs font-serif-en font-bold text-gold-gradient mt-1 block">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-xs text-[#8c8271]">
              {lang === 'ar' ? 'لم يتم العثور على قطع تطابق البحث' : 'No items match your search.'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
