import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, showToast, setActiveCategory, setViewMode, siteSettings } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(lang === 'ar' ? 'مرحباً بكِ في النادي الفاخر لدودو ديزاين' : 'Welcome to Dodo Design VIP Circle');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#08080a] border-t border-[#23201a] text-[#c2b8a5] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* VIP Newsletter Section */}
        <div className="bg-gradient-to-r from-[#121116] via-[#1a1820] to-[#121116] border border-[#2d2922] rounded-2xl p-8 sm:p-12 mb-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-serif-ar tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'انضمي إلى عالمنا الخاص' : 'Exclusive VIP Circle'}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-en font-bold text-[#f5f0e6] mb-3">
              {lang === 'ar' ? 'دعوة خاصة لمعاينات الكوتور والفعاليات' : 'Be First to Experience Private Shows'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a09684] mb-6 font-light">
              {lang === 'ar'
                ? 'احصلي على دعوات خاصة لمعاينة المجموعات الموسمية قبل طرحها ودعوات عروض أزياء أسبوع الهوت كوتور.'
                : 'Receive private invitations for seasonal previews, haute couture weeks, and trunk show appointments.'}
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخلي بريدك الإلكتروني...' : 'Enter your email address...'}
                className="flex-1 bg-[#0b0b0e] border border-[#2e2922] focus:border-[#d4af37] text-xs px-4 py-3 rounded text-[#f0e8d8] placeholder-[#6e6658] outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-semibold text-xs uppercase tracking-wider rounded hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'انضمام' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* Brand Logo & Slogan */}
        <div className="space-y-3">
          <div className="cursor-pointer inline-block" onClick={() => { setViewMode('store'); setActiveCategory('all'); }}>
            <span className="text-3xl font-serif-en font-bold text-gold-gradient tracking-widest block">
              DODO DESIGN
            </span>
            <span className="text-xs font-serif-ar text-[#a09684] tracking-widest mt-1 block">
              {lang === 'ar' ? 'دودو ديزاين • أزياء فاخرة' : 'Dodo Design • Luxury Couture'}
            </span>
          </div>
          <p className="text-xs text-[#8c8271] font-light max-w-md mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'تصاميم فاخرة ومميزة تعكس أنوثتك وأسلوبك الفريد. خياطة متقنة بأجود خامات الأقمشة.'
              : 'Exclusive luxury fashion designed with precision tailoring and premium fabrics.'}
          </p>
        </div>

        {/* Simple Payment & Contact Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#a09684] pt-2 border-t border-b border-[#1f1d17] py-6">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] font-bold">{lang === 'ar' ? 'خدمة العملاء:' : 'Customer Care:'}</span>
            <span dir="ltr" className="inline-block font-mono text-[#f0e8d8]">{siteSettings.phone || '01100935555'}</span>
          </div>
          <span className="text-[#3a352a] hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] font-bold">{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
            <span>{siteSettings.email || 'support@dododesign.shop'}</span>
          </div>
          <span className="text-[#3a352a] hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] font-bold">{lang === 'ar' ? 'طرق الدفع المتاحة:' : 'Accepted Payments:'}</span>
            <span>{lang === 'ar' ? 'كاش عند الاستلام / إنستا باي / فودافون كاش' : 'Cash on Delivery / InstaPay / Vodafone Cash'}</span>
          </div>
        </div>

        {/* Copyright & Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#706758] gap-4 pt-2">
          <p>© 2026 DODO DESIGN | {lang === 'ar' ? 'جميع الحقوق محفوظة لـ دودو ديزاين.' : 'All Rights Reserved. Dodo Design.'}</p>
          
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#8c8271]">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>InstaPay</span>
            <span>•</span>
            <span>Vodafone Cash</span>
          </div>
        </div>

      </div>
      </div>
    </footer>
  );
};
