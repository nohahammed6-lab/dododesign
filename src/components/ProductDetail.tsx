import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Ruler,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Share2
} from 'lucide-react';
import { ProductColor } from '../types';

export const ProductDetail: React.FC = () => {
  const {
    lang,
    products,
    selectedProductId,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    setViewMode,
    showToast,
    addReviewToProduct
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { nameAr: 'أسود', nameEn: 'Black', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReviewToProduct(product.id, {
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setIsReviewFormOpen(false);
    showToast(lang === 'ar' ? 'شكراً لتقييمك! تم حفظ تقييمك بنجاح.' : 'Thank you! Your review has been published.');
  };

  // Accordion open state
  const [activeAccordion, setActiveAccordion] = useState<'details' | 'shipping' | 'authenticity' | null>('details');

  const isWishlisted = isInWishlist(product.id);

  const title = lang === 'ar' ? product.titleAr : product.titleEn;
  const description = lang === 'ar' ? product.descriptionAr : product.descriptionEn;
  const categoryName = lang === 'ar' ? product.categoryNameAr : product.categoryNameEn;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(lang === 'ar' ? 'تم نسخ رابط القطعة' : 'Product link copied to clipboard');
    }
  };

  // Related matching items (excluding current product)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#a8a08f] mb-8 font-light">
        <button
          onClick={() => setViewMode('store')}
          className="hover:text-[#d4af37] transition"
        >
          {lang === 'ar' ? 'الرئيسية' : 'Home'}
        </button>
        {lang === 'ar' ? <ChevronLeft className="w-3.5 h-3.5 text-[#5e584a]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#5e584a]" />}
        <button
          onClick={() => setViewMode('store')}
          className="hover:text-[#d4af37] transition"
        >
          {categoryName}
        </button>
        {lang === 'ar' ? <ChevronLeft className="w-3.5 h-3.5 text-[#5e584a]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#5e584a]" />}
        <span className="text-[#f0e8d8] font-medium line-clamp-1">{title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
        
        {/* Gallery Section (Left/Right depending on RTL) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-none">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative min-w-[75px] w-[75px] h-[95px] rounded overflow-hidden border-2 transition duration-200 ${
                  activeImageIndex === idx ? 'border-[#d4af37] shadow-lg scale-95' : 'border-[#2d2922] opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Display Image */}
          <div className="relative flex-1 aspect-[3/4] bg-[#141317] rounded-lg overflow-hidden border border-[#2d2922] shadow-2xl group">
            <img
              src={product.images[activeImageIndex]}
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Limited Tag */}
            {product.isLimitedEdition && (
              <span className="absolute top-4 left-4 rtl:right-4 rtl:left-auto px-3 py-1 bg-[#100f12]/90 border border-[#d4af37]/60 text-[#f0e0b3] text-xs font-semibold rounded uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                {lang === 'ar' ? 'إصدار فاخر محدود' : 'LIMITED EDITION'}
              </span>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2.5 bg-[#121115]/80 hover:bg-[#d4af37] text-[#d4af37] hover:text-black rounded-full transition border border-[#3d3629] backdrop-blur-md"
              title="Share Item"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info & Buying Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-[#a39a89] mb-3">
              <span className="uppercase tracking-widest font-serif-ar text-[#d4af37]">{categoryName}</span>
              <div className="flex items-center gap-1 text-[#e5c158]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-[#f0e8d8]">{product.rating}</span>
                <span className="text-xs text-[#8c8475]">({product.reviewsCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-ar font-bold text-[#f5f0e6] leading-tight mb-4">
              {title}
            </h1>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-serif-en font-bold text-gold-gradient mb-6 pb-6 border-b border-[#26231c] flex items-center justify-between">
              <span>{formatPrice(product.price)}</span>
              <span className="text-xs text-[#a09786] font-normal">
                {lang === 'ar' ? 'شامل ضريبة القيمة المضافة والشحن الملكي' : 'Includes VAT & White-Glove Shipping'}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-[#c7beac] font-light leading-relaxed mb-6">
              {description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="text-[#a8a08f] font-medium">{lang === 'ar' ? 'اللون الخارجي:' : 'Color:'}</span>
                <span className="text-[#f0e8d8] font-semibold">{lang === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => {
                  const isSelected = selectedColor.hex === color.hex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-8 h-8 rounded-full border-2 transition duration-200 flex items-center justify-center ${
                        isSelected ? 'border-[#d4af37] scale-110 shadow-lg shadow-[#d4af37]/20' : 'border-[#383329]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={lang === 'ar' ? color.nameAr : color.nameEn}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector + Size Guide */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="text-[#a8a08f] font-medium">{lang === 'ar' ? 'اختر المقاس:' : 'Select Size:'}</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'دليل المقاسات' : 'Size Guide'}</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 rounded text-xs font-semibold uppercase transition duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black border border-[#d4af37] shadow-md'
                          : 'bg-[#141317] border border-[#2d2922] text-[#dcd6c8] hover:border-[#d4af37]/60'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs text-[#a8a08f] font-medium">{lang === 'ar' ? 'الكمية:' : 'Quantity:'}</span>
              <div className="flex items-center border border-[#2d2922] bg-[#141317] rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-[#d4af37] hover:bg-[#23201a] transition"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#f0e8d8]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-[#d4af37] hover:bg-[#23201a] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Add To Bag & Buy Now */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-semibold text-sm tracking-widest uppercase rounded shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة إلى حقيبة التسوق' : 'Add to Shopping Bag'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 bg-[#17161c] border border-[#d4af37]/60 text-[#f5e8cd] hover:bg-[#d4af37]/10 font-semibold text-xs tracking-wider uppercase rounded transition"
                >
                  {lang === 'ar' ? 'اشتري الآن (دفع سريع)' : 'Buy Now (Express Checkout)'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded border transition ${
                    isWishlisted
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#141317] border border-[#2d2922] text-[#d4af37] hover:border-[#d4af37]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Key Assurance Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#121115] rounded-lg border border-[#232019] text-center mb-8">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[10px] text-[#c2b9a7]">
                  {lang === 'ar' ? 'شحن سريع ومجاني' : 'Express Delivery'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[10px] text-[#c2b9a7]">
                  {lang === 'ar' ? 'أصالة 100% مضمونة' : '100% Authentic'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[10px] text-[#c2b9a7]">
                  {lang === 'ar' ? 'إرجاع واستبدال سلس' : 'Easy Returns'}
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#26231c] divide-y divide-[#26231c]">
              
              {/* Accordion 1: Details & Care */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                  className="w-full py-4 flex items-center justify-between text-sm font-semibold text-[#f0e8d8] hover:text-[#d4af37] transition text-left rtl:text-right"
                >
                  <span>{lang === 'ar' ? 'التفاصيل والعناية بالقطعة' : 'Details & Fabric Care'}</span>
                  <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'details' && (
                  <div className="pb-4 text-xs text-[#a8a08f] font-light leading-relaxed space-y-2">
                    <p>{lang === 'ar' ? product.careInstructionsAr : product.careInstructionsEn}</p>
                    <p className="text-[#d4af37] font-mono">SKU: {product.sku}</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping & Returns */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full py-4 flex items-center justify-between text-sm font-semibold text-[#f0e8d8] hover:text-[#d4af37] transition text-left rtl:text-right"
                >
                  <span>{lang === 'ar' ? 'الشحن والتوصيل الفاخر' : 'Shipping & Complimentary Returns'}</span>
                  <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="pb-4 text-xs text-[#a8a08f] font-light leading-relaxed">
                    <p>
                      {lang === 'ar'
                        ? 'يتم تغليف جميع القطع في علب الدار التذكارية المغطاة للمحافظة على الفخامة. التوصيل خلال 1-3 أيام عمل في السعودية والإمارات وخليج عمان.'
                        : 'Delivered in signature keepsake boxes. Express 1-3 day courier service available across GCC and international destinations.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Authenticity */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'authenticity' ? null : 'authenticity')}
                  className="w-full py-4 flex items-center justify-between text-sm font-semibold text-[#f0e8d8] hover:text-[#d4af37] transition text-left rtl:text-right"
                >
                  <span>{lang === 'ar' ? 'شهادة أصالة الدار' : 'Authenticity Certificate'}</span>
                  <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${activeAccordion === 'authenticity' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'authenticity' && (
                  <div className="pb-4 text-xs text-[#a8a08f] font-light leading-relaxed">
                    <p>
                      {lang === 'ar'
                        ? 'كل قطعة تخرج من مشغل دودو ديزاين تحمل رقماً تسلسلياً فريداً ومصحوبة بشهادة الضمان الملكي للأقمشة والتطريز اليدوي.'
                        : 'Every masterpiece comes with a gold-embossed certificate of authenticity and unique artisan sequence number.'}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Product Reviews & Rating Form Section */}
            <div className="mt-10 pt-8 border-t border-[#26231c]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-serif-ar font-bold text-[#f5f0e6] flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
                    <span>{lang === 'ar' ? 'تقييمات وآراء العملاء' : 'Customer Reviews'}</span>
                  </h3>
                  <p className="text-xs text-[#a09684] mt-0.5">
                    {lang === 'ar'
                      ? `متوسط التقييم ${product.rating} من 5 بناءً على ${product.reviewsCount} تقييم`
                      : `Average ${product.rating} out of 5 based on ${product.reviewsCount} reviews`}
                  </p>
                </div>

                <button
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="px-4 py-2 bg-[#1b1922] border border-[#3d3629] text-[#d4af37] hover:bg-[#d4af37] hover:text-black rounded text-xs font-semibold transition"
                >
                  {isReviewFormOpen
                    ? (lang === 'ar' ? 'إغلاق النموذج' : 'Close Form')
                    : (lang === 'ar' ? 'إضافة تقييمك' : 'Write a Review')}
                </button>
              </div>

              {/* Review Form */}
              {isReviewFormOpen && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-5 bg-[#121115] border border-[#2d2922] rounded-xl space-y-4 shadow-xl">
                  <h4 className="text-xs font-bold text-[#f0e8d8] uppercase tracking-wider">
                    {lang === 'ar' ? 'اكتبي تقييمك عن هذه القطعة' : 'Submit Your Product Review'}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#a09684]">{lang === 'ar' ? 'التقييم:' : 'Rating:'}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#3d3629]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#a09684] mb-1">{lang === 'ar' ? 'الاسم:' : 'Your Name:'}</label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: نورة العتيبي' : 'e.g. Sarah M.'}
                        className="w-full bg-[#18161e] border border-[#2e2922] focus:border-[#d4af37] text-xs p-2.5 rounded text-[#f0e8d8] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#a09684] mb-1">{lang === 'ar' ? 'تعليقك وتقييمك:' : 'Review Comment:'}</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتبي انطباعك عن جودة الخياطة والمقاس والتصميم...' : 'Share your experience with fit, fabric, and tailoring...'}
                      className="w-full bg-[#18161e] border border-[#2e2922] focus:border-[#d4af37] text-xs p-2.5 rounded text-[#f0e8d8] outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded shadow hover:brightness-110 transition"
                  >
                    {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 bg-[#121115] border border-[#22201a] rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#f0e8d8]">{rev.userName}</span>
                        <div className="flex items-center gap-1 text-[#d4af37]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-[#3a352a]'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#b0a798] font-light leading-relaxed mb-1">{rev.comment}</p>
                      <span className="text-[10px] text-[#706859]">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#7d7465] italic text-center py-4">
                    {lang === 'ar' ? 'لا توجد تقييمات مسبقة. كوني أول من يضيف تقييماً لهذا المنتج!' : 'No reviews yet. Be the first to leave a review!'}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Matching Items / Related Section ("قطع متناغمة") */}
      <div className="pt-16 border-t border-[#26231c]">
        <div className="mb-8">
          <span className="text-xs text-[#d4af37] font-serif-ar uppercase tracking-widest block mb-1">
            {lang === 'ar' ? 'تنسيقات مميزة' : 'Curated Styling'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'قطع متناغمة من إبداع الدار' : 'Harmonious Complements'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
};
