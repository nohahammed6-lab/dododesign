import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Phone, MessageCircle, Instagram, Mail, Save, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export const SiteSettingsManagement: React.FC = () => {
  const { lang, siteSettings, updateSiteSettings } = useApp();

  const [phone, setPhone] = useState(siteSettings.phone || '01100935555');
  const [whatsapp, setWhatsapp] = useState(siteSettings.whatsapp || '201100935555');
  const [instagramHandle, setInstagramHandle] = useState(siteSettings.instagramHandle || 'dodoo__designs');
  const [instagramUrl, setInstagramUrl] = useState(siteSettings.instagramUrl || 'https://www.instagram.com/dodoo__designs');
  const [email, setEmail] = useState(siteSettings.email || 'support@dododesign.shop');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (siteSettings) {
      setPhone(siteSettings.phone || '');
      setWhatsapp(siteSettings.whatsapp || '');
      setInstagramHandle(siteSettings.instagramHandle || '');
      setInstagramUrl(siteSettings.instagramUrl || '');
      setEmail(siteSettings.email || '');
    }
  }, [siteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings({
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      instagramHandle: instagramHandle.trim().replace(/^@/, ''),
      instagramUrl: instagramUrl.trim(),
      email: email.trim(),
    });
    setIsSaving(false);
  };

  // Compute clean WhatsApp URL preview
  const cleanWhatsappNumber = whatsapp.replace(/[^0-9]/g, '');
  const whatsappPreviewUrl = `https://wa.me/${cleanWhatsappNumber}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Sliders className="w-5 h-5" />
            <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'إعدادات أرقام التواصل وروابط المتجر' : 'Store Contact & Social Settings'}
            </h1>
          </div>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'التحكم المباشر في رقم الهاتف والواتساب والإنستجرام والبريد الإلكتروني الظاهرة لزوار المتجر.'
              : 'Update phone number, WhatsApp, Instagram links, and customer support email shown across the site.'}
          </p>
        </div>
      </div>

      {/* Settings Form Card */}
      <form onSubmit={handleSave} className="bg-[#121116] border border-[#2b251b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Phone Number Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#f0e8d8] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'رقم الاتصال المباشر (Phone Number)' : 'Direct Phone Number'}</span>
            </label>
            <p className="text-[11px] text-[#a09684]">
              {lang === 'ar' ? 'الرقم الذي يظهر في الهيدر والفوتر وقائمة المتجر.' : 'Displayed in Header, Footer, and Store Menu.'}
            </p>
            <input
              type="text"
              dir="ltr"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01100935555"
              className="w-full bg-[#18161d] border border-[#383022] focus:border-[#d4af37] text-sm py-3 px-4 text-[#f0e8d8] rounded-xl outline-none font-mono text-left"
            />
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#f0e8d8] flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25d366]" />
              <span>{lang === 'ar' ? 'رقم الواتساب (WhatsApp Number)' : 'WhatsApp Direct Number'}</span>
            </label>
            <p className="text-[11px] text-[#a09684]">
              {lang === 'ar' ? 'اكتب الرقم بالكود الدولي بدون + (مثال: 201100935555).' : 'Include country code without + (e.g. 201100935555).'}
            </p>
            <input
              type="text"
              dir="ltr"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="201100935555"
              className="w-full bg-[#18161d] border border-[#383022] focus:border-[#25d366] text-sm py-3 px-4 text-[#f0e8d8] rounded-xl outline-none font-mono text-left"
            />
            {cleanWhatsappNumber && (
              <p className="text-[10px] text-[#25d366] font-mono flex items-center gap-1">
                <span>رابط الواتساب التلقائي:</span>
                <a href={whatsappPreviewUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                  {whatsappPreviewUrl}
                </a>
              </p>
            )}
          </div>

          {/* Instagram Handle Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#f0e8d8] flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[#e1306c]" />
              <span>{lang === 'ar' ? 'اسم حساب الإنستجرام (Username)' : 'Instagram Username'}</span>
            </label>
            <p className="text-[11px] text-[#a09684]">
              {lang === 'ar' ? 'اسم الحساب المعروض في الشارة العائمة (مثال: dodoo__designs).' : 'Username shown on floating badge (e.g. dodoo__designs).'}
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09684] font-mono text-sm">@</span>
              <input
                type="text"
                dir="ltr"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="dodoo__designs"
                className="w-full bg-[#18161d] border border-[#383022] focus:border-[#e1306c] text-sm py-3 pl-8 pr-4 text-[#f0e8d8] rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          {/* Instagram Full URL Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#f0e8d8] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'رابط صفحة الإنستجرام الكامل' : 'Instagram Page URL'}</span>
            </label>
            <p className="text-[11px] text-[#a09684]">
              {lang === 'ar' ? 'الرابط الكامل الذي يتم توجيه الزبون إليه عند الضغط.' : 'Full URL opened when customer clicks.'}
            </p>
            <input
              type="url"
              dir="ltr"
              required
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/dodoo__designs"
              className="w-full bg-[#18161d] border border-[#383022] focus:border-[#d4af37] text-sm py-3 px-4 text-[#f0e8d8] rounded-xl outline-none font-mono text-left"
            />
          </div>

        </div>

        {/* Support Email Field */}
        <div className="space-y-2 pt-4 border-t border-[#23201a]">
          <label className="block text-xs font-bold text-[#f0e8d8] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <span>{lang === 'ar' ? 'البريد الإلكتروني لدعم العملاء' : 'Customer Support Email'}</span>
          </label>
          <p className="text-[11px] text-[#a09684]">
            {lang === 'ar' ? 'البريد المعروض في الفوتر لمعاملات المتجر والتأكيدات.' : 'Email listed in Footer for business inquiries.'}
          </p>
          <input
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="support@dododesign.shop"
            className="w-full bg-[#18161d] border border-[#383022] focus:border-[#d4af37] text-sm py-3 px-4 text-[#f0e8d8] rounded-xl outline-none font-mono text-left"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-[#23201a] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:brightness-110 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSaving
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (lang === 'ar' ? 'حفظ وتحديث بيانات المتجر المباشرة' : 'Save & Update Store Information')}
            </span>
          </button>
        </div>

      </form>

      {/* Live Preview Card */}
      <div className="p-6 bg-[#0f0e13] border border-[#262118] rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'ar' ? 'معاينة مباشرة لكيفية ظهور أرقامك للزبائن:' : 'Live Preview of how contact details will look:'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#18161d] border border-[#2b251a] rounded-xl space-y-1">
            <span className="text-[10px] text-[#a09684] block">{lang === 'ar' ? 'هاتف خدمة العملاء:' : 'Phone Care:'}</span>
            <span dir="ltr" className="font-mono text-[#f0e8d8] font-bold block">{phone || '—'}</span>
          </div>

          <div className="p-3 bg-[#18161d] border border-[#1e3b27] rounded-xl space-y-1">
            <span className="text-[10px] text-[#a09684] block">{lang === 'ar' ? 'واتساب المباشر:' : 'WhatsApp:'}</span>
            <span dir="ltr" className="font-mono text-[#25d366] font-bold block">{whatsapp || '—'}</span>
          </div>

          <div className="p-3 bg-[#18161d] border border-[#3d1a29] rounded-xl space-y-1">
            <span className="text-[10px] text-[#a09684] block">{lang === 'ar' ? 'حساب إنستجرام:' : 'Instagram:'}</span>
            <span dir="ltr" className="font-mono text-[#e1306c] font-bold block">@{instagramHandle || '—'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
