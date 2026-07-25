import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { OrdersManagement } from './OrdersManagement';
import { CustomerManagement } from './CustomerManagement';
import { LayoutDashboard, Package, ShoppingBag, Users, Store, ArrowLeft, ArrowRight, ShieldCheck, Globe, Copy, Check, Link2, Sparkles } from 'lucide-react';
import { AdminTab } from '../../types';

export const AdminLayout: React.FC = () => {
  const { lang, setLang, adminTab, setAdminTab, setViewMode, showToast } = useApp();
  const [isCopied, setIsCopied] = useState(false);

  const adminUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#admin`
    : 'https://ais-dev-ndpugu67tolc7usxgoxvlq-634145787652.europe-west2.run.app/#admin';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(adminUrl);
    setIsCopied(true);
    showToast(lang === 'ar' ? 'تم نسخ رابط لوحة التحكم بنجاح!' : 'Admin URL copied to clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const tabs: { key: AdminTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      key: 'overview',
      labelAr: 'نظرة عامة والتحليلات',
      labelEn: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      key: 'products',
      labelAr: 'إدارة الكتالوج والمخزون',
      labelEn: 'Products Catalog',
      icon: <Package className="w-4 h-4" />
    },
    {
      key: 'orders',
      labelAr: 'إدارة الطلبات والشحن',
      labelEn: 'Orders & Shipping',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      key: 'customers',
      labelAr: 'كبار العملاء VIP',
      labelEn: 'VIP Member Directory',
      icon: <Users className="w-4 h-4" />
    },
  ];

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
            {/* Direct Link Banner */}
            <div className="flex items-center gap-2 bg-[#16141c] border border-[#332b1f] px-3 py-1.5 rounded-lg text-xs">
              <Link2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[#a89b88] hidden sm:inline font-mono text-[11px] max-w-[200px] truncate">
                {adminUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2 py-1 bg-[#231f28] hover:bg-[#d4af37] hover:text-black text-[#d4af37] rounded transition text-[11px] font-semibold cursor-pointer"
                title="Copy Link"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>

            {/* Language Toggle in Admin Panel */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#19171f] border border-[#312c22] rounded text-xs text-[#dcd7cb] hover:border-[#d4af37] transition font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
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
            {tabs.map((tab) => {
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
          {adminTab === 'orders' && <OrdersManagement />}
          {adminTab === 'customers' && <CustomerManagement />}
        </main>

      </div>

    </div>
  );
};
