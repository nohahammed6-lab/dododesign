import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { OrdersManagement } from './OrdersManagement';
import { CustomerManagement } from './CustomerManagement';
import { ReviewsManagement } from './ReviewsManagement';
import { SiteSettingsManagement } from './SiteSettingsManagement';
import { ModeratorsManagement } from './ModeratorsManagement';
import { LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, Store, ArrowLeft, ArrowRight, ShieldCheck, Globe, Copy, Check, Link2, Sparkles, Download, Code, Lock, Key, LogOut, Sliders, Shield } from 'lucide-react';
import { AdminTab, AdminPermissions } from '../../types';

export const AdminLayout: React.FC = () => {
  const { lang, setLang, adminTab, setAdminTab, setViewMode, showToast, products, orders, customers, moderators, currentModerator, setCurrentModerator } = useApp();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  // Password Protection State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dodo_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = passwordInput.trim();

    // Check Master Password first
    if (cleanPin === 'dododesign123') {
      sessionStorage.setItem('dodo_admin_auth', 'true');
      setIsAuthenticated(true);
      setCurrentModerator(null); // Owner full access
      setAuthError('');
      showToast(lang === 'ar' ? 'تم تسجيل الدخول كمالك رئيسي للوحة التحكم!' : 'Authenticated as Master Owner!');
      return;
    }

    // Check Moderator PIN Code
    const matchedMod = moderators.find((m) => m.pinCode === cleanPin);
    if (matchedMod) {
      if (matchedMod.isLocked) {
        setAuthError(lang === 'ar' ? 'هذا الحساب معطل حالياً من قِبل الإدارة.' : 'This account is locked.');
        return;
      }
      sessionStorage.setItem('dodo_admin_auth', 'true');
      setIsAuthenticated(true);
      setCurrentModerator(matchedMod);
      setAuthError('');

      // Redirect to first permitted tab
      if (matchedMod.permissions) {
        if (matchedMod.permissions.overview) setAdminTab('overview');
        else if (matchedMod.permissions.orders) setAdminTab('orders');
        else if (matchedMod.permissions.products) setAdminTab('products');
        else if (matchedMod.permissions.reviews) setAdminTab('reviews');
        else if (matchedMod.permissions.customers) setAdminTab('customers');
        else if (matchedMod.permissions.settings) setAdminTab('settings');
        else if (matchedMod.permissions.moderators) setAdminTab('moderators');
      }

      showToast(lang === 'ar' ? `مرحباً بك ${matchedMod.name}!` : `Welcome ${matchedMod.name}!`);
    } else {
      setAuthError(
        lang === 'ar'
          ? 'رمز الدخول أو كلمة المرور غير صحيحة.'
          : 'Incorrect password or PIN code.'
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dodo_admin_auth');
    setIsAuthenticated(false);
    setCurrentModerator(null);
    setPasswordInput('');
    showToast(lang === 'ar' ? 'تم قفل لوحة التحكم بنجاح' : 'Admin panel locked');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] text-[#f2efe9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111015] border border-[#382f21] rounded-2xl p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c]"></div>

          <div className="w-16 h-16 mx-auto bg-[#1c1822] border border-[#d4af37]/40 rounded-2xl flex items-center justify-center text-[#d4af37] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-serif-ar font-bold text-gold-gradient">
              {lang === 'ar' ? 'لوحة تحكم أزياء DODO DESIGN' : 'DODO DESIGN Admin Portal'}
            </h2>
            <p className="text-xs text-[#a39783] mt-2 leading-relaxed">
              {lang === 'ar'
                ? 'منطقة محمية - يرجى إدخال كلمة المرور الخاصة بالإدارة للوصول إلى التحكم'
                : 'Restricted area - Please enter password to manage store products and orders'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError('');
                }}
                placeholder={lang === 'ar' ? 'أدخل كلمة المرور...' : 'Enter password...'}
                className="w-full bg-[#18161d] border border-[#3b3224] focus:border-[#d4af37] text-center text-sm py-3 px-4 text-[#f0e8d8] rounded-xl outline-none transition font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-[#f28888] mt-2 font-medium">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-black" />
              <span>{lang === 'ar' ? 'دخول لوحة التحكم' : 'Unlock Dashboard'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-[#23201a]">
            <button
              onClick={() => setViewMode('store')}
              className="text-xs text-[#a09684] hover:text-[#d4af37] transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'العودة للمتجر الرئيسي' : 'Return to Store'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyExportCode = () => {
    const code = `// Paste this updated data into src/data/mockData.ts to publish changes permanently to Vercel
export const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};
export const INITIAL_ORDERS = ${JSON.stringify(orders, null, 2)};
export const INITIAL_CUSTOMERS = ${JSON.stringify(customers, null, 2)};
`;
    navigator.clipboard.writeText(code);
    setCopiedData(true);
    showToast(lang === 'ar' ? 'تم نسخ كود البيانات لـ GitHub بنجاح!' : 'Export code copied to clipboard!');
    setTimeout(() => setCopiedData(false), 3000);
  };

  const allTabs: { key: AdminTab; labelAr: string; labelEn: string; icon: React.ReactNode; permKey?: keyof AdminPermissions }[] = [
    {
      key: 'overview',
      labelAr: 'نظرة عامة والتحليلات',
      labelEn: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      permKey: 'overview',
    },
    {
      key: 'products',
      labelAr: 'إدارة الكتالوج والمخزون',
      labelEn: 'Products Catalog',
      icon: <Package className="w-4 h-4" />,
      permKey: 'products',
    },
    {
      key: 'reviews',
      labelAr: 'إدارة التقييمات وآراء العملاء',
      labelEn: 'Reviews Management',
      icon: <MessageSquare className="w-4 h-4" />,
      permKey: 'reviews',
    },
    {
      key: 'orders',
      labelAr: 'إدارة الحجوزات والطلبات',
      labelEn: 'Orders & Bookings',
      icon: <ShoppingBag className="w-4 h-4" />,
      permKey: 'orders',
    },
    {
      key: 'customers',
      labelAr: 'كبار العملاء VIP',
      labelEn: 'VIP Member Directory',
      icon: <Users className="w-4 h-4" />,
      permKey: 'customers',
    },
    {
      key: 'settings',
      labelAr: 'إعدادات أرقام المساعدة والتواصل',
      labelEn: 'Store Contact Settings',
      icon: <Sliders className="w-4 h-4" />,
      permKey: 'settings',
    },
    {
      key: 'moderators',
      labelAr: 'إدارة المشرفين والصلاحيات',
      labelEn: 'Moderators & Permissions',
      icon: <ShieldCheck className="w-4 h-4" />,
      permKey: 'moderators',
    },
  ];

  const visibleTabs = allTabs.filter((t) => {
    if (!currentModerator) return true; // Owner has full access
    if (!t.permKey) return true;
    return !!currentModerator.permissions?.[t.permKey];
  });

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f2efe9] flex flex-col">
      
      {/* Top Portal Header */}
      <div className="bg-[#100f13] border-b border-[#26221c] py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1c1a21] border border-[#d4af37]/40 text-[#d4af37] rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif-en font-bold text-gold-gradient tracking-widest block">
                  DODO DESIGN MANAGEMENT
                </span>
                <span className="px-2 py-0.5 bg-[#1b381d] text-[#7de385] border border-[#2b6130] text-[10px] font-mono rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {lang === 'ar' ? 'مستقل ومباشر' : 'Live & Synced'}
                </span>
              </div>
              <span className="text-[11px] font-serif-ar text-[#9e9278]">
                {lang === 'ar' ? 'لوحة تحكم وتعديل أزياء دودو ديزاين' : 'Dodo Design Management Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
            {/* Active User Name Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18161e] border border-[#2e2820] rounded-lg text-xs font-semibold text-[#e8ded0]">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{currentModerator ? currentModerator.name : (lang === 'ar' ? 'المالك الرئيسي (Admin)' : 'Master Owner')}</span>
            </div>

            {/* Export Code for GitHub button */}
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1a14] border border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black text-[#d4af37] rounded text-xs transition font-semibold cursor-pointer"
              title="تصدير الكود لـ GitHub"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصدير لـ GitHub / Vercel' : 'Export for GitHub'}</span>
            </button>

            {/* Language Toggle in Admin Panel */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#19171f] border border-[#312c22] rounded text-xs text-[#dcd7cb] hover:border-[#d4af37] transition font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Lock Admin Panel Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#261819] border border-[#522020] text-[#f28888] hover:bg-[#e03e3e] hover:text-white rounded text-xs transition font-semibold cursor-pointer"
              title={lang === 'ar' ? 'قفل لوحة التحكم' : 'Lock Admin Panel'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'قفل اللوحة' : 'Lock Panel'}</span>
            </button>

            <button
              onClick={() => setViewMode('store')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1820] border border-[#d4af37]/50 text-[#f5e6be] hover:bg-[#d4af37] hover:text-black rounded transition text-xs font-semibold shadow-md cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الموقع الرئيسي' : 'Customer Store'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-[#111015] border border-[#26221c] rounded-xl p-3 space-y-1 sticky top-24 shadow-xl">
            {visibleTabs.map((tab) => {
              const isActive = adminTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setAdminTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition text-left rtl:text-right ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black shadow-lg shadow-[#d4af37]/10'
                      : 'text-[#c2b8a5] hover:bg-[#19171f] hover:text-[#f5f0e6]'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-[#d4af37]'}>{tab.icon}</span>
                  <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dynamic Tab Content View */}
        <main className="flex-1 min-w-0">
          {adminTab === 'overview' && <DashboardOverview />}
          {adminTab === 'products' && <ProductManagement />}
          {adminTab === 'reviews' && <ReviewsManagement />}
          {adminTab === 'orders' && <OrdersManagement />}
          {adminTab === 'customers' && <CustomerManagement />}
          {adminTab === 'settings' && <SiteSettingsManagement />}
          {adminTab === 'moderators' && <ModeratorsManagement />}
        </main>

      </div>

      {/* Export for GitHub Modal */}
      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111015] border border-[#3d3322] w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#26221c] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-bold text-base font-serif-ar text-gold-gradient">
                  {lang === 'ar' ? 'تحديث البيانات الدائمة لجميع الزوار على Vercel' : 'Publish Permanent Changes to Vercel'}
                </h3>
              </div>
              <button
                onClick={() => setIsDataModalOpen(false)}
                className="text-[#a39783] hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#dcd7cb]">
              <div className="p-3.5 bg-[#181510] border border-[#3b311e] rounded-xl text-[#e8dbbf]">
                <p className="font-semibold text-amber-300 mb-1">
                  💡 لماذا لا تظهر التعديلات للجميع مباشرة على Vercel؟
                </p>
                <p>
                  لأن المواقع المستضافة كـ Frontend على Vercel تعمل في متصفح كل زائر بشكل مستقل وتحفظ تعديلاتك في الـ LocalStorage الخاصة بجهازك فقط. 
                  لكي تظهر التعديلات التي أجريتها (المنتجات، التقييمات، الطلبات) لجميع زوار الدومين على أي هاتف أو جهاز:
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-[#c7bfae] bg-[#16141b] p-4 rounded-xl border border-[#2b251a]">
                <li>
                  اضغط على زر <strong className="text-[#d4af37]">"نسخ كود mockData التراكمي"</strong> أدناه.
                </li>
                <li>
                  افتح مستودع مشروعك على <strong className="text-white">GitHub</strong> وافتح الملف <code className="bg-[#211d27] px-1.5 py-0.5 rounded text-[#d4af37]">src/data/mockData.ts</code>.
                </li>
                <li>
                  استبدل محتوى الملف بالكود المنسوخ واعمل <strong className="text-white">Commit Changes</strong>.
                </li>
                <li>
                  سيقوم Vercel بإعادة البناء وتحديث البيانات المباشرة فوراً لكل زوار الدومين مجاناً!
                </li>
              </ol>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={handleCopyExportCode}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                >
                  {copiedData ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>{copiedData ? (lang === 'ar' ? 'تم نسخ كود mockData!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود mockData التراكمي' : 'Copy Updated mockData Code')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
