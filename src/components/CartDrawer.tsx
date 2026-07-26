import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ColorSwatch } from './ColorSwatch';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    setIsCheckoutOpen,
    showToast
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DODO10' || promoCode.trim().toUpperCase() === 'AURA10') {
      setDiscountPercent(10);
      showToast(lang === 'ar' ? 'تم تطبيق خصم 10% الحصري' : '10% VIP Promo applied');
    } else {
      showToast(lang === 'ar' ? 'رمز الخصم غير صحيح (جربي DODO10)' : 'Invalid code (Try DODO10)');
    }
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#0f0e12] border-l rtl:border-l-0 rtl:border-r border-[#2d2922] shadow-2xl flex flex-col justify-between text-[#f2efe9]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#23201a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg font-serif-ar font-bold text-[#f5f0e6]">
                {lang === 'ar' ? 'حقيبة التسوق الفاخرة' : 'Shopping Bag'}
              </h2>
              <span className="text-xs text-[#a09684] font-bold px-2 py-0.5 bg-[#1f1d17] rounded-full border border-[#383227]">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#a09684] hover:text-[#d4af37] rounded-full hover:bg-[#1f1d17] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length > 0 ? (
              cart.map((item) => {
                const title = lang === 'ar' ? item.product.titleAr : item.product.titleEn;
                const colorObj = item.selectedColor || { nameAr: 'الأسود الملكي', nameEn: 'Royal Black', hex: '#0a0a0a' };
                const colorName = lang === 'ar' ? colorObj.nameAr : colorObj.nameEn;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#151419] rounded-lg border border-[#26221c] relative group hover:border-[#d4af37]/40 transition"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 rounded overflow-hidden bg-[#1f1d24] flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-serif-ar font-semibold text-[#f5f0e6] line-clamp-1">
                            {title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#807666] hover:text-[#e05252] transition p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#9c9383] mt-1">
                          <span className="flex items-center gap-1.5">
                            <ColorSwatch color={item.selectedColor} size="xs" showTitle={false} />
                            {colorName}
                          </span>
                          <span>•</span>
                          <span>{lang === 'ar' ? `المقاس: ${item.selectedSize}` : `Size: ${item.selectedSize}`}</span>
                        </div>
                      </div>

                      {/* Quantity & Item Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#23201a]">
                        <div className="flex items-center border border-[#2d2922] bg-[#0f0e12] rounded">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-[#d4af37] hover:bg-[#23201a]"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#f0e8d8]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-[#d4af37] hover:bg-[#23201a]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-xs font-serif-en font-bold text-gold-gradient">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-[#3a352a] mx-auto mb-3" />
                <p className="text-[#a09684] text-sm font-serif-ar">
                  {lang === 'ar' ? 'حقيبة التسوق فارغة حالياً' : 'Your shopping bag is currently empty'}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-xs font-semibold rounded hover:bg-[#d4af37] hover:text-black transition"
                >
                  {lang === 'ar' ? 'استكشفي المجموعات' : 'Explore Collections'}
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#23201a] bg-[#121115] space-y-4">
              
              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#9a8d78] absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={lang === 'ar' ? 'كود الخصم (جرّبي DODO10)' : 'Promo code (Try DODO10)'}
                    className="w-full bg-[#18161c] border border-[#2e2922] focus:border-[#d4af37] text-xs py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-[#f0e8d8] rounded focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#26231c] border border-[#3d372b] text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-xs font-semibold rounded transition"
                >
                  {lang === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </form>

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs text-[#a09684]">
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-semibold text-[#f0e8d8]">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#82c974]">
                    <span>{lang === 'ar' ? `خصم VIP (${discountPercent}%):` : `VIP Discount (${discountPercent}%):`}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#82c974]">
                  <span>{lang === 'ar' ? 'التوصيل الفاخر:' : 'White-Glove Shipping:'}</span>
                  <span className="font-semibold">{lang === 'ar' ? 'مجاني' : 'Complimentary'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#f5f0e6] pt-2 border-t border-[#26231c]">
                  <span>{lang === 'ar' ? 'الإجمالي النهائي:' : 'Total:'}</span>
                  <span className="text-gold-gradient font-serif-en text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'متابعة الشراء والتأكيد' : 'Proceed to Checkout'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#807666]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'دفع آمن ومشفر 100%' : '100% Encrypted & Secure Checkout'}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
