import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserPlus, Lock, Key, Trash2, Edit3, Check, X, ShieldAlert, Sparkles, UserCheck, Eye, EyeOff } from 'lucide-react';
import { Moderator, AdminPermissions } from '../../types';

const DEFAULT_PERMISSIONS: AdminPermissions = {
  overview: true,
  products: true,
  orders: true,
  customers: false,
  reviews: true,
  settings: false,
  moderators: false,
};

const FULL_PERMISSIONS: AdminPermissions = {
  overview: true,
  products: true,
  orders: true,
  customers: true,
  reviews: true,
  settings: true,
  moderators: true,
};

export const ModeratorsManagement: React.FC = () => {
  const { lang, moderators, addModerator, updateModerator, deleteModerator, currentModerator } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<Moderator | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [role, setRole] = useState<'owner' | 'moderator'>('moderator');
  const [permissions, setPermissions] = useState<AdminPermissions>(DEFAULT_PERMISSIONS);
  const [showPin, setShowPin] = useState(false);

  const handleOpenAddModal = () => {
    setEditingMod(null);
    setName('');
    setEmail('');
    setPinCode('');
    setRole('moderator');
    setPermissions(DEFAULT_PERMISSIONS);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mod: Moderator) => {
    setEditingMod(mod);
    setName(mod.name);
    setEmail(mod.email);
    setPinCode(mod.pinCode);
    setRole(mod.role);
    setPermissions(mod.permissions || FULL_PERMISSIONS);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pinCode.trim()) return;

    if (editingMod) {
      updateModerator(editingMod.id, {
        name,
        email,
        pinCode,
        role,
        permissions,
      });
    } else {
      addModerator({
        name,
        email: email || `${Date.now()}@dododesign.shop`,
        pinCode,
        role,
        permissions,
      });
    }
    setIsModalOpen(false);
  };

  const togglePermission = (key: keyof AdminPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'إدارة المشرفين وتحديد الصلاحيات' : 'Moderator & Permission Management'}
            </h1>
            <span className="px-2.5 py-0.5 bg-[#1f1a14] border border-[#d4af37]/60 text-[#d4af37] text-[10px] font-bold rounded-full">
              {moderators.length} {lang === 'ar' ? 'مشرفين' : 'Moderators'}
            </span>
          </div>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'إضافة مشرفين جدد وتحديد خانات التحكم المتاحة لكل مشرف بشكل مستقل.'
              : 'Add new admin users and define granular access permissions for each section.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-black" />
          <span>{lang === 'ar' ? 'إضافة مشرف جديد' : 'Add New Moderator'}</span>
        </button>
      </div>

      {/* Logged in User Banner */}
      <div className="bg-[#121116] border border-[#2d271f] p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1f1b24] border border-[#d4af37]/40 text-[#d4af37] rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#8c816f] uppercase font-bold block tracking-wider">
              {lang === 'ar' ? 'حساب الجلسة الحالية' : 'Current Session'}
            </span>
            <span className="text-xs font-bold text-[#f0e8d8]">
              {currentModerator ? currentModerator.name : (lang === 'ar' ? 'المالك الرئيسي (صلاحيات كاملة)' : 'Owner (Full Access)')}
            </span>
          </div>
        </div>

        <div className="text-xs text-[#a09684] bg-[#18161d] px-3 py-1.5 rounded-lg border border-[#29241d]">
          {lang === 'ar' ? 'كلمة مرور المالك الرئيسي:' : 'Owner Password:'}{' '}
          <code className="text-[#d4af37] font-mono font-bold">dododesign123</code>
        </div>
      </div>

      {/* Moderators List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moderators.map((mod) => (
          <div
            key={mod.id}
            className={`p-5 rounded-2xl border transition duration-200 space-y-4 flex flex-col justify-between ${
              mod.role === 'owner'
                ? 'bg-[#15131a] border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/5'
                : 'bg-[#121116] border-[#26221c] hover:border-[#3d362a]'
            }`}
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                    mod.role === 'owner'
                      ? 'bg-[#292212] border-[#d4af37] text-[#d4af37]'
                      : 'bg-[#1c1922] border-[#383125] text-[#e0d6c3]'
                  }`}>
                    {mod.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#f5f0e6]">{mod.name}</h3>
                      {mod.role === 'owner' ? (
                        <span className="px-2 py-0.5 bg-[#2b2210] border border-[#6b5523] text-[#d4af37] text-[9px] font-bold rounded-full">
                          {lang === 'ar' ? 'المالك الرئيسي' : 'Owner'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#1b2229] border border-[#2b3a4a] text-[#82b8e5] text-[9px] font-bold rounded-full">
                          {lang === 'ar' ? 'مشرف مخصص' : 'Moderator'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8c8271] block font-mono mt-0.5">{mod.email}</span>
                  </div>
                </div>

                {/* PIN Code Badge */}
                <div className="text-[11px] bg-[#18161e] border border-[#2e2820] px-2.5 py-1 rounded-lg text-[#d4af37] font-mono font-semibold flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  <span>{mod.pinCode}</span>
                </div>
              </div>

              {/* Permissions List Badges */}
              <div className="space-y-1.5 pt-3 border-t border-[#23201a]">
                <span className="text-[10px] text-[#8a7f6c] font-semibold block uppercase">
                  {lang === 'ar' ? 'الخانات والصلاحيات المسموحة:' : 'Allowed Sections:'}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {mod.permissions?.overview && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      📊 {lang === 'ar' ? 'التحليلات' : 'Overview'}
                    </span>
                  )}
                  {mod.permissions?.products && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      👗 {lang === 'ar' ? 'المنتجات' : 'Products'}
                    </span>
                  )}
                  {mod.permissions?.orders && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      🛍️ {lang === 'ar' ? 'الحجوزات والطلبات' : 'Orders'}
                    </span>
                  )}
                  {mod.permissions?.customers && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      👥 {lang === 'ar' ? 'العملاء' : 'VIP Customers'}
                    </span>
                  )}
                  {mod.permissions?.reviews && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      💬 {lang === 'ar' ? 'التقييمات' : 'Reviews'}
                    </span>
                  )}
                  {mod.permissions?.settings && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      ⚙️ {lang === 'ar' ? 'الإعدادات' : 'Settings'}
                    </span>
                  )}
                  {mod.permissions?.moderators && (
                    <span className="px-2 py-0.5 bg-[#192b1a] border border-[#284a2a] text-[#7ce083] text-[10px] rounded font-medium">
                      🛡️ {lang === 'ar' ? 'المشرفين' : 'Moderators'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#23201a]">
              <button
                onClick={() => handleOpenEditModal(mod)}
                className="px-3 py-1.5 bg-[#1c1a22] text-[#d4af37] hover:bg-[#d4af37] hover:text-black border border-[#383125] rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تعديل الصلاحيات' : 'Edit Access'}</span>
              </button>

              {mod.role !== 'owner' && (
                <button
                  onClick={() => deleteModerator(mod.id)}
                  className="px-3 py-1.5 bg-[#2b1718] text-[#f28888] hover:bg-[#e03e3e] hover:text-white border border-[#522020] rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  title={lang === 'ar' ? 'حذف المشرف' : 'Delete Moderator'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Moderator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0f0e12] border border-[#312a20] rounded-2xl shadow-2xl p-6 text-[#f2efe9] space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#23201a]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#211c14] border border-[#d4af37]/40 text-[#d4af37] rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif-ar font-bold text-base text-[#f5f0e6]">
                  {editingMod
                    ? (lang === 'ar' ? `تعديل صلاحيات ${editingMod.name}` : `Edit Moderator ${editingMod.name}`)
                    : (lang === 'ar' ? 'إضافة مشرف جديد' : 'Add New Moderator')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#a09684] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#c7beaf] mb-1">
                    {lang === 'ar' ? 'اسم المشرف:' : 'Moderator Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: أحمد (مبيعات)' : 'e.g. Ahmed Sales'}
                    className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs p-2.5 rounded-lg text-[#f0e8d8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#c7beaf] mb-1">
                    {lang === 'ar' ? 'رمز الدخول / كلمة المرور:' : 'Password / PIN:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs p-2.5 rounded-lg text-[#f0e8d8] outline-none font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2.5 rtl:left-2.5 rtl:right-auto top-1/2 -translate-y-1/2 text-[#8c8271] hover:text-[#d4af37]"
                    >
                      {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c7beaf] mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dododesign.shop"
                  className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs p-2.5 rounded-lg text-[#f0e8d8] outline-none font-mono"
                />
              </div>

              {/* Presets Quick Buttons */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-[#8a7f6c] font-semibold block uppercase">
                  {lang === 'ar' ? 'نماذج صلاحيات سريعة:' : 'Quick Presets:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPermissions(FULL_PERMISSIONS)}
                    className="px-2.5 py-1 bg-[#241f17] border border-[#4d3e26] text-[#d4af37] text-[10px] font-bold rounded-lg hover:bg-[#d4af37] hover:text-black transition"
                  >
                    ✨ {lang === 'ar' ? 'صلاحيات كاملة' : 'Full Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPermissions({
                        overview: true,
                        products: true,
                        orders: true,
                        customers: false,
                        reviews: true,
                        settings: false,
                        moderators: false,
                      })
                    }
                    className="px-2.5 py-1 bg-[#18161d] border border-[#2e2921] text-[#c2b8a5] text-[10px] font-bold rounded-lg hover:border-[#d4af37] transition"
                  >
                    🛍️ {lang === 'ar' ? 'منتجات وحجوزات فقط' : 'Orders & Products Only'}
                  </button>
                </div>
              </div>

              {/* Permissions Checkboxes Grid */}
              <div className="space-y-2 pt-2 border-t border-[#23201a]">
                <span className="text-[11px] text-[#f0e8d8] font-bold block">
                  {lang === 'ar' ? 'تحديد الخانات التي يمكن للمشرف التحكم فيها:' : 'Select Allowed Sections:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'overview', titleAr: '📊 النظرة العامة والتحليلات', titleEn: 'Overview & Analytics' },
                    { key: 'products', titleAr: '👗 إدارة المنتجات والكتالوج', titleEn: 'Products Catalog' },
                    { key: 'orders', titleAr: '🛍️ إدارة الحجوزات والطلبات', titleEn: 'Orders & Bookings' },
                    { key: 'reviews', titleAr: '💬 إدارة التقييمات آراء العملاء', titleEn: 'Customer Reviews' },
                    { key: 'customers', titleAr: '👥 إدارة العملاء كبار VIP', titleEn: 'VIP Members' },
                    { key: 'settings', titleAr: '⚙️ إعدادات أرقام التواصل', titleEn: 'Store Settings' },
                    { key: 'moderators', titleAr: '🛡️ إدارة المشرفين والصلاحيات', titleEn: 'Moderator Admin' },
                  ].map((p) => {
                    const isChecked = permissions[p.key as keyof AdminPermissions];
                    return (
                      <label
                        key={p.key}
                        onClick={() => togglePermission(p.key as keyof AdminPermissions)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-[#1c2e1f] border-[#2c5230] text-[#7de385]'
                            : 'bg-[#15141a] border-[#29251e] text-[#8c8271] hover:border-[#383228]'
                        }`}
                      >
                        <span className="text-xs font-semibold">{lang === 'ar' ? p.titleAr : p.titleEn}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                            isChecked ? 'bg-[#7de385] border-[#7de385] text-black' : 'border-[#4a4235]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 font-bold" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#23201a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1a1820] text-[#a09684] hover:text-white border border-[#2e2922] rounded-xl text-xs font-semibold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer"
                >
                  {editingMod
                    ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                    : (lang === 'ar' ? 'إضافة المشرف' : 'Add Moderator')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
