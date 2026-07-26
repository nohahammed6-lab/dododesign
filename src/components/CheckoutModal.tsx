import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Truck, Lock } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    lang,
    cart,
    cartSubtotal,
    formatPrice,
    currency,
    isCheckoutOpen,
    setIsCheckoutOpen,
    addOrder
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrderItems = cart.map((item) => ({
      productId: item.product.id,
      productTitleAr: item.product.titleAr,
      productTitleEn: item.product.titleEn,
      color: item.selectedColor.nameAr,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
    }));

    addOrder({
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      items: newOrderItems,
      totalAmount: cartSubtotal,
      currency,
      paymentMethod,
      shippingAddress,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl text-[#f2efe9] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-[#23201a] bg-[#121116] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-lg font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'إتمام الطلب الشريف الملكي' : 'Royal Checkout'}
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-[#a09684] hover:text-[#d4af37] rounded-full hover:bg-[#1f1d17] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 sm:p-8">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#23201a] text-xs">
              <div className={`flex items-center gap-2 font-semibold ${step >= 1 ? 'text-[#d4af37]' : 'text-[#615848]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>{lang === 'ar' ? 'معلومات الشحن' : 'Shipping'}</span>
              </div>
              <span className="text-[#3a3429]">• • •</span>
              <div className={`flex items-center gap-2 font-semibold ${step >= 2 ? 'text-[#d4af37]' : 'text-[#615848]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
              </div>
              <span className="text-[#3a3429]">• • •</span>
              <div className={`flex items-center gap-2 font-semibold ${step >= 3 ? 'text-[#d4af37]' : 'text-[#615848]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>{lang === 'ar' ? 'التأكيد' : 'Review'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder}>
              
              {/* STEP 1: Shipping Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#f0e8d8] mb-2">
                    {lang === 'ar' ? 'بيانات التوصيل المستهدف' : 'Recipient & Delivery Details'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={lang === 'ar' ? 'أدخل الاسم الثلاثي...' : 'Enter your full name...'}
                        className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none placeholder:text-[#524b3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'رقم الهاتف / الجوال *' : 'Phone Number *'}</label>
                      <input
                        type="tel"
                        dir="ltr"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="010xxxxxxx"
                        className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none font-mono text-left placeholder:text-[#524b3e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: name@domain.com' : 'e.g. name@domain.com'}
                        className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none placeholder:text-[#524b3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'المدينة / المحافظة *' : 'City / Governorate *'}</label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder={lang === 'ar' ? 'القاهرة، الجيزة، الإسكندرية...' : 'Cairo, Giza, Alexandria...'}
                        className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none placeholder:text-[#524b3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'عنوان الشحن بالتفصيل *' : 'Detailed Delivery Address *'}</label>
                    <textarea
                      rows={2}
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={lang === 'ar' ? 'الشارع، رقم المبنى، الشقة، العلامة المميزة...' : 'Street, building number, apartment, landmark...'}
                      className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none resize-none placeholder:text-[#524b3e]"
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded shadow-lg hover:brightness-110 transition"
                  >
                    {lang === 'ar' ? 'الانتقال لوسيلة الدفع' : 'Continue to Payment'}
                  </button>
                </div>
              )}

              {/* STEP 2: Payment Methods */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#f0e8d8] mb-2">
                    {lang === 'ar' ? 'اختر وسيلة الدفع المعتمدة' : 'Select Payment Method'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام (كاش)', nameEn: 'Cash on Delivery' },
                      { id: 'InstaPay', nameAr: 'إنستا باي (InstaPay)', nameEn: 'InstaPay Direct' },
                      { id: 'Vodafone Cash', nameAr: 'فودافون كاش (Vodafone Cash)', nameEn: 'Vodafone Cash' }
                    ].map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition flex items-center gap-3 ${
                            isSelected
                              ? 'border-[#d4af37] bg-[#1a1813] shadow-md'
                              : 'border-[#2d2922] bg-[#141318] hover:border-[#423a2d]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-[#52493a]'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                          </div>
                          <span className="text-xs font-semibold text-[#f0e8d8]">
                            {lang === 'ar' ? pm.nameAr : pm.nameEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {(paymentMethod === 'InstaPay' || paymentMethod === 'Vodafone Cash') && (
                    <div className="p-3 bg-[#181620] border border-[#d4af37]/40 rounded-lg text-xs text-[#d4af37]">
                      {lang === 'ar'
                        ? 'سيتم تزويدك برقم المحفظة / عنوان التحويل المباشر فور تأكيد الطلب للتواصل والتأكيد عبر الواتساب.'
                        : 'Transfer details will be provided upon order submission.'}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 bg-[#17161c] border border-[#2d2922] text-[#c2b8a5] text-xs font-semibold rounded hover:bg-[#211f26]"
                    >
                      {lang === 'ar' ? 'السابق' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded shadow-lg hover:brightness-110 transition"
                    >
                      {lang === 'ar' ? 'مراجعة ملخص الطلب' : 'Review Order Summary'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Order Review & Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#f0e8d8] mb-2">
                    {lang === 'ar' ? 'ملخص الطلب النهائي' : 'Final Order Review'}
                  </h3>

                  <div className="p-4 bg-[#141318] rounded-lg border border-[#2d2922] space-y-2 text-xs text-[#a09684]">
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'العميل:' : 'Customer:'}</span>
                      <span className="text-[#f0e8d8] font-medium">{customerName} ({customerCity})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
                      <span dir="ltr" className="text-[#f0e8d8] font-mono">{customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'وسيلة الدفع:' : 'Payment:'}</span>
                      <span className="text-[#d4af37] font-semibold">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'عدد القطع:' : 'Items Count:'}</span>
                      <span className="text-[#f0e8d8]">{cart.length} {lang === 'ar' ? 'قطع' : 'items'}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#26231c] text-sm font-bold text-[#f5f0e6]">
                      <span>{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                      <span className="text-gold-gradient font-serif-en">{formatPrice(cartSubtotal)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3.5 bg-[#17161c] border border-[#2d2922] text-[#c2b8a5] text-xs font-semibold rounded hover:bg-[#211f26]"
                    >
                      {lang === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-extrabold text-xs uppercase tracking-widest rounded shadow-2xl hover:brightness-110 transition flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm & Place Order'}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>

          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#d4af37]/20 border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs text-[#d4af37] font-serif-ar tracking-widest block mb-1 uppercase">
                {lang === 'ar' ? 'تم تسجيل طلبك بنجاح' : 'Order Placed Successfully'}
              </span>
              <h3 className="text-2xl font-serif-ar font-bold text-[#f5f0e6] mb-2">
                {lang === 'ar' ? 'شكراً لاختيارك دار دودو ديزاين' : 'Thank You for Choosing Dodo Design'}
              </h3>
              <p className="text-xs text-[#a09684] max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'تم إرسال تفاصيل التتبع عبر الرسائل النصية والبريد الإلكتروني. سيتواصل معك مستشار الشحن الخاص بنا لتنسيق التوصيل.'
                  : 'Your bespoke package is being prepared with utmost care in our atelier.'}
              </p>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                setIsCheckoutOpen(false);
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition"
            >
              {lang === 'ar' ? 'العودة للمتجر' : 'Return to Store'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
