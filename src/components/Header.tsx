import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, Heart, Globe, Sparkles, Menu, X, Home, Grid, Phone, Instagram, Mail, Ruler, MessageCircle, Truck, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    setViewMode,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setIsWishlistOpen,
    setIsSizeGuideOpen,
    setActiveCategory,
  } = useApp();

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 ${isSideMenuOpen ? 'z-[100]' : 'z-40'} bg-[#0b0b0d]/95 backdrop-blur-md border-b border-[#2a2720]/80 transition-all duration-300`}>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#121215] via-[#211d15] to-[#121215] text-[#e0c885] text-xs py-2 px-4 border-b border-[#312a1a]/50 text-center tracking-wider font-light flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#9a885f]">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === 'ar' ? 'دودو ديزاين - اون لاين ستور' : 'Dodo Design - Online Store'}</span>
        </div>
        
        <p className="mx-auto flex items-center justify-center gap-2 font-medium text-[11px] sm:text-xs">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
          {lang === 'ar'
            ? 'توصيل لجميع المحافظات | الدفع عند الاستلام كاش / إنستا باي / فودافون كاش'
            : 'Shipping Across Egypt | Cash on Delivery / InstaPay / Vodafone Cash'}
        </p>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#9a885f]">
          <span>{lang === 'ar' ? 'أزياء فاخرة' : 'Haute Couture'}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Side Menu Toggle (3 Bars) & Desktop Navigation */}
          <div className="flex items-center gap-4">
            {/* 3 Bars Menu Button */}
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2.5 text-[#dcd7cb] hover:text-[#d4af37] hover:bg-[#1f1d18] rounded-lg transition border border-[#2d281f] flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              aria-label="Open Side Menu"
              title={lang === 'ar' ? 'قائمة الموقع' : 'Site Menu'}
            >
              <Menu className="w-6 h-6 text-[#d4af37]" />
              <span className="text-xs font-semibold hidden sm:inline text-[#e0d6c3]">
                {lang === 'ar' ? 'القائمة' : 'Menu'}
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide text-[#dcd7cb]">
              <button
                onClick={() => { setViewMode('store'); setActiveCategory('all'); }}
                className="hover:text-[#d4af37] transition duration-200 py-1 border-b border-transparent hover:border-[#d4af37] flex items-center gap-2 text-xs"
              >
                <span>{lang === 'ar' ? 'المعرض الموحد لجميع الأزيـاء' : 'Unified Fashion Collection'}</span>
              </button>
            </nav>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={() => { setViewMode('store'); setActiveCategory('all'); }}>
            <span className="text-2xl sm:text-3xl tracking-[0.2em] font-serif-en font-semibold text-gold-gradient group-hover:scale-105 transition-transform duration-300">
              DODO DESIGN
            </span>
            <span className="text-xs font-serif-ar tracking-widest text-[#9e9278] -mt-0.5">
              دودو ديزاين • اون لاين ستور
            </span>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* EGP Currency Badge */}
            <div className="px-2.5 py-1 bg-[#16151a] border border-[#2e2a22] text-[#d4af37] rounded text-[11px] font-bold tracking-wider hidden sm:block">
              {lang === 'ar' ? 'ج.م (EGP)' : 'EGP'}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-xs text-[#dcd7cb] hover:text-[#d4af37] px-2 py-1 border border-[#2a261f] rounded bg-[#131216] transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-semibold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#dcd7cb] hover:text-[#d4af37] hover:bg-[#1f1d18] rounded-full transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-[#dcd7cb] hover:text-[#d4af37] hover:bg-[#1f1d18] rounded-full transition relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#d4af37] text-black font-bold text-[10px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#dcd7cb] hover:text-[#d4af37] hover:bg-[#1f1d18] rounded-full transition relative border border-[#302c23] bg-[#141317]"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#e0c885]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-extrabold text-xs rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Side Navigation Menu Drawer (3 Bars Menu) - Portal to Body for top overlay */}
      {isSideMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsSideMenuOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity z-10 cursor-pointer"
          ></div>

          {/* Drawer Sidebar - Pinned properly to start (right side in Arabic RTL) */}
          <div className="fixed top-0 bottom-0 start-0 z-20 w-80 max-w-[85vw] bg-[#0d0c12] border-e border-[#383022] shadow-[0_0_80px_rgba(0,0,0,0.98)] flex flex-col p-6 text-[#f2efe9] overflow-y-auto">
            
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#23201a] mb-6">
              <div>
                <span className="text-xl font-serif-en font-bold text-gold-gradient block">
                  DODO DESIGN
                </span>
                <span className="text-[10px] font-serif-ar text-[#a09684]">
                  {lang === 'ar' ? 'قائمة المتجر المباشرة' : 'Store Main Menu'}
                </span>
              </div>
              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="p-2 text-[#a09684] hover:text-[#d4af37] hover:bg-[#1c1a22] rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 flex-1">
              <button
                onClick={() => {
                  setViewMode('store');
                  setActiveCategory('all');
                  setIsSideMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page'}</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('store');
                  setActiveCategory('all');
                  setIsSideMenuOpen(false);
                  const el = document.getElementById('featured-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <Grid className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'معرض الأزياء الموحد' : 'Unified Fashion Collection'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>{lang === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}</span>
                </div>
                {cartCount > 0 ? (
                  <span className="px-2 py-0.5 bg-[#d4af37] text-black font-bold text-[10px] rounded-full">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#8a806f]">{lang === 'ar' ? 'فارغة' : 'Empty'}</span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#d4af37]" />
                  <span>{lang === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}</span>
                </div>
                {wishlist.length > 0 ? (
                  <span className="px-2 py-0.5 bg-[#d4af37] text-black font-bold text-[10px] rounded-full">
                    {wishlist.length}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#8a806f]">{lang === 'ar' ? 'فارغة' : 'Empty'}</span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'البحث عن تصميم معين' : 'Search Products'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  setIsSizeGuideOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#16151c] hover:bg-[#201d26] border border-[#2d281f] text-xs font-semibold text-[#f0e8d8] transition cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'جدول المقاسات الشامل' : 'Size Guide Table'}</span>
              </button>

              <a
                href="https://www.instagram.com/dodoo__designs"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSideMenuOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border border-[#d4af37]/40 text-xs font-semibold text-[#f0e8d8] hover:brightness-125 transition"
              >
                <Instagram className="w-4 h-4 text-[#e1306c]" />
                <span>{lang === 'ar' ? 'انستجرام دودو ديزاين' : 'Instagram Page'}</span>
              </a>

              <a
                href="https://wa.me/201100935555"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSideMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#25d366]/10 border border-[#25d366]/40 text-xs font-semibold text-[#f0e8d8] hover:bg-[#25d366]/20 transition"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#25d366]" />
                  <span>{lang === 'ar' ? 'طلب خاص عبر الواتساب' : 'WhatsApp Support'}</span>
                </div>
                <span dir="ltr" className="font-mono text-[#25d366] text-[11px] font-bold">01100935555</span>
              </a>
            </div>

            {/* Shipping & Payment Footer info in Side Menu */}
            <div className="pt-6 border-t border-[#23201a] space-y-3 text-[11px] text-[#a09684]">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Truck className="w-3.5 h-3.5" />
                <span className="font-bold">{lang === 'ar' ? 'شحن لجميع المحافظات' : 'Shipping Across Egypt'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span dir="ltr" className="inline-block font-mono text-[#f0e8d8] text-left">01100935555</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>support@dododesign.shop</span>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

