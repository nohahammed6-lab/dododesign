import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    lang,
    products,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    openProductDetail,
    formatPrice,
    addToCart
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#0f0e12] border-l rtl:border-l-0 rtl:border-r border-[#2d2922] shadow-2xl flex flex-col text-[#f2efe9]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#23201a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#d4af37] fill-current" />
              <h2 className="text-lg font-serif-ar font-bold text-[#f5f0e6]">
                {lang === 'ar' ? 'قائمة الأمنيات الملكية' : 'Wishlist'}
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-[#a09684] hover:text-[#d4af37] rounded-full hover:bg-[#1f1d17] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length > 0 ? (
              wishlistedProducts.map((p) => {
                const title = lang === 'ar' ? p.titleAr : p.titleEn;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-3 bg-[#141318] rounded-lg border border-[#26221c] group hover:border-[#d4af37]/40 transition"
                  >
                    <img src={p.images[0]} alt={title} className="w-16 h-20 object-cover rounded bg-[#1f1d24]" />
                    <div className="flex-1">
                      <h3 className="text-xs font-serif-ar font-semibold text-[#f5f0e6] line-clamp-1">{title}</h3>
                      <span className="text-xs font-serif-en font-bold text-gold-gradient block mt-1">
                        {formatPrice(p.price)}
                      </span>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => {
                            addToCart(p, p.colors[0], p.sizes[0], 1);
                            setIsWishlistOpen(false);
                          }}
                          className="px-3 py-1 bg-[#d4af37] text-black font-semibold text-[11px] rounded hover:brightness-110 transition flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'نقل للحقيبة' : 'Move to Bag'}</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1 text-[#807666] hover:text-[#e05252] transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <Heart className="w-12 h-12 text-[#3a352a] mx-auto mb-3" />
                <p className="text-[#a09684] text-sm font-serif-ar">
                  {lang === 'ar' ? 'قائمة الأمنيات فارغة' : 'Your wishlist is currently empty'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
