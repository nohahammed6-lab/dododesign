import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    formatPrice,
    openProductDetail,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );

  const isWishlisted = isInWishlist(product.id);

  const title = lang === 'ar' ? product.titleAr : product.titleEn;
  const categoryName = lang === 'ar' ? product.categoryNameAr : product.categoryNameEn;

  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.colors[0], selectedSize, 1, false);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => openProductDetail(product.id)}
      className="group relative bg-[#131216] rounded-lg border border-[#27231c] hover:border-[#d4af37]/70 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/10"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a181d]">
        <img
          src={product.images[0]}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-95 group-hover:brightness-100"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 rtl:right-3 rtl:left-auto flex flex-col gap-1.5 z-10">
          {product.isLimitedEdition && (
            <span className="px-2.5 py-1 bg-[#100f12]/90 border border-[#d4af37]/60 text-[#e8c872] text-[10px] font-semibold tracking-wider rounded uppercase flex items-center gap-1 shadow-md backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              {lang === 'ar' ? 'إصدار محدود' : 'LIMITED'}
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-[#381111]/90 border border-[#8a2222] text-[#f29191] text-[10px] font-medium rounded shadow-md backdrop-blur-sm">
              {lang === 'ar' ? `متبقي ${product.stock} فقط` : `Only ${product.stock} Left`}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 rtl:left-3 rtl:right-auto p-2.5 rounded-full z-10 transition duration-300 backdrop-blur-md ${
            isWishlisted
              ? 'bg-[#d4af37] text-black shadow-lg scale-110'
              : 'bg-[#121115]/80 text-[#d4af37] hover:bg-[#d4af37] hover:text-black border border-[#3d3629]'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View / Add overlay bar on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 font-semibold text-xs tracking-wider uppercase rounded transition flex items-center justify-center gap-1.5 shadow-md ${
              added
                ? 'bg-[#25d366] text-black font-bold scale-98'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black hover:brightness-110'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 font-bold" />
                <span>{lang === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? `إضافة للسلة (${selectedSize})` : `Add to Bag (${selectedSize})`}</span>
              </>
            )}
          </button>
          <button
            onClick={() => openProductDetail(product.id)}
            className="p-2.5 bg-[#1e1c17] border border-[#d4af37]/40 text-[#f0e6ce] hover:bg-[#d4af37]/20 rounded transition"
            title="Detail View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-grow justify-between border-t border-[#23201a] space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#9a907e] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[#d4af37]">{categoryName}</span>
            <div className="flex items-center gap-1 text-[#e5c158]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-xs text-[#f0e6ce]">{product.rating}</span>
              <span className="text-[10px] text-[#807666]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-serif-ar font-medium text-[#f3eee2] line-clamp-1 group-hover:text-[#d4af37] transition duration-200 mb-2">
            {title}
          </h3>

          {/* Interactive Size Selection Directly on Homepage Card */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="my-2 bg-[#0d0c10] p-2 rounded-lg border border-[#27231c]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#a09684] font-semibold">
                  {lang === 'ar' ? 'اختر المقاس مباشرة:' : 'Select Size:'}
                </span>
                <span className="text-[10px] font-bold text-[#d4af37]">{selectedSize}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(sz);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-mono transition-all border ${
                        isSelected
                          ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-md scale-105'
                          : 'bg-[#18161f] text-[#c4b9a5] border-[#2d281f] hover:border-[#d4af37]/60 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Button */}
        <div className="space-y-2 pt-2 border-t border-[#1f1d17]">
          <div className="flex items-center justify-between">
            <div className="text-base sm:text-lg font-serif-en font-bold text-gold-gradient">
              {formatPrice(product.price)}
            </div>

            {/* Color Dots */}
            <div className="flex items-center gap-1">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-[#4a4235]"
                  style={{ backgroundColor: color.hex }}
                  title={lang === 'ar' ? color.nameAr : color.nameEn}
                ></span>
              ))}
            </div>
          </div>

          {/* Direct Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2 font-bold text-xs uppercase tracking-wider rounded shadow transition flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-[#25d366] text-black font-bold scale-98'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black hover:brightness-110'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 font-bold" />
                <span>{lang === 'ar' ? 'تمت الإضافة للسلة بنجاح ✓' : 'Added to Cart ✓'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
