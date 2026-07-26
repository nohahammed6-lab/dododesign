import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, Phone, Mail, MapPin, Plus, Edit2, Trash2, Search, Filter, X, UserCheck } from 'lucide-react';
import { Customer } from '../../types';

export const CustomerManagement: React.FC = () => {
  const { lang, customers, addCustomer, updateCustomer, deleteCustomer, formatPrice } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Royal VIP' | 'Gold VIP' | 'Silver VIP'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    tier: 'Gold VIP' as 'Royal VIP' | 'Gold VIP' | 'Silver VIP',
    totalOrders: 1,
    totalSpent: 0,
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: lang === 'ar' ? 'القاهرة' : 'Cairo',
      tier: 'Gold VIP',
      totalOrders: 1,
      totalSpent: 1000,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      tier: customer.tier,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        tier: formData.tier,
        totalOrders: Number(formData.totalOrders),
        totalSpent: Number(formData.totalSpent),
      });
      setEditingCustomer(null);
    } else {
      await addCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        tier: formData.tier,
        totalOrders: Number(formData.totalOrders),
        totalSpent: Number(formData.totalSpent),
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    setDeletingCustomerId(null);
  };

  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      cust.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || cust.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'سجل كبار العميلات والفرسان VIP' : 'VIP Member Directory'}
          </h1>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'التحكم الكامل في إضافة وتعديل وحذف كبار العملاء وتعيين الفئات الخاصة يدوياً.'
              : 'Full manual management to add, edit, tier, and delete VIP members.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة عميل VIP جديد' : 'Add New VIP Member'}</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#121016] p-4 rounded-xl border border-[#23201a]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#a09684]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بالاسم، رقم الهاتف أو المدينة...' : 'Search by name, phone, or city...'}
            className="w-full bg-[#1a1820] border border-[#30281e] focus:border-[#d4af37] text-xs py-2 pr-9 pl-3 text-[#f0e8d8] rounded-lg outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#d4af37]" />
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="bg-[#1a1820] border border-[#30281e] text-xs py-2 px-3 text-[#f0e8d8] rounded-lg outline-none focus:border-[#d4af37] cursor-pointer"
          >
            <option value="all">{lang === 'ar' ? 'جميع الفئات' : 'All Tiers'}</option>
            <option value="Royal VIP">Royal VIP</option>
            <option value="Gold VIP">Gold VIP</option>
            <option value="Silver VIP">Silver VIP</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 bg-[#121016] border border-[#23201a] rounded-xl text-[#a09684]">
          <UserCheck className="w-12 h-12 mx-auto mb-3 text-[#d4af37]/40" />
          <p className="text-sm font-semibold">{lang === 'ar' ? 'لا يوجد عملاء مطابقون للبحث' : 'No VIP members found'}</p>
        </div>
      )}

      {/* Grid of VIP Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-6 bg-[#121116] border border-[#26221c] hover:border-[#d4af37]/60 rounded-xl shadow-lg transition duration-300 relative group"
          >
            <div className="flex items-start justify-between mb-4 border-b border-[#23201a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1e1c24] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] font-serif-ar text-lg font-bold">
                  {cust.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-serif-ar font-bold text-[#f5f0e6]">{cust.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#a09684] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    <span>{cust.city}</span>
                  </div>
                </div>
              </div>

              {/* Tier Badge */}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1d17] border border-[#d4af37]/60 text-[#e0c885] flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{cust.tier}</span>
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-[#17161c] rounded-lg border border-[#23201a] text-xs mb-4">
              <div>
                <span className="text-[#8c8271] block mb-0.5">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</span>
                <span className="font-bold text-[#f0e8d8] text-sm">{cust.totalOrders} {lang === 'ar' ? 'طلبات' : 'orders'}</span>
              </div>
              <div>
                <span className="text-[#8c8271] block mb-0.5">{lang === 'ar' ? 'الإنفاق التراكمي' : 'Lifetime Spend'}</span>
                <span className="font-serif-en font-bold text-gold-gradient text-sm">{formatPrice(cust.totalSpent)}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5 text-xs text-[#a09684] mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span dir="ltr" className="inline-block font-mono text-[#f0e8d8]">{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{cust.email || '—'}</span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e1c22]">
              <button
                onClick={() => openEditModal(cust)}
                className="px-3 py-1.5 bg-[#1e1b24] hover:bg-[#d4af37] hover:text-black text-[#d4af37] border border-[#3d3322] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تعديل البيانات' : 'Edit Member'}</span>
              </button>
              <button
                onClick={() => setDeletingCustomerId(cust.id)}
                className="px-3 py-1.5 bg-[#2b1718] hover:bg-[#e03e3e] hover:text-white text-[#f28888] border border-[#522020] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Customer Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#121016] border border-[#3b3121] rounded-2xl shadow-2xl p-6 text-[#f2efe9] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#23201a] pb-4">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Crown className="w-5 h-5" />
                <h3 className="font-bold text-base font-serif-ar text-[#f0e8d8]">
                  {editingCustomer
                    ? lang === 'ar' ? 'تعديل بيانات العميل VIP' : 'Edit VIP Customer'
                    : lang === 'ar' ? 'إضافة عميل كبار شخصيات جديد' : 'Add New VIP Member'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="p-1 hover:bg-[#1f1c24] text-[#a09684] hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={lang === 'ar' ? 'مثال: ندى الأحمد' : 'e.g. Nada Al-Ahmad'}
                  className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@domain.com"
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'المدينة / المنطقة' : 'City / Region'}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={lang === 'ar' ? 'القاهرة' : 'Cairo'}
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'فئة العضوية VIP' : 'VIP Member Tier'}</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none cursor-pointer"
                  >
                    <option value="Royal VIP">Royal VIP (ملكي)</option>
                    <option value="Gold VIP">Gold VIP (ذهبي)</option>
                    <option value="Silver VIP">Silver VIP (فضي)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'عدد الطلبات' : 'Total Orders'}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalOrders}
                    onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a09684] mb-1">{lang === 'ar' ? 'إجمالي الإنفاق (ج.م)' : 'Total Spent (EGP)'}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalSpent}
                    onChange={(e) => setFormData({ ...formData, totalSpent: Number(e.target.value) })}
                    className="w-full bg-[#18161d] border border-[#332b20] focus:border-[#d4af37] py-2 px-3 text-[#f0e8d8] rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#23201a]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2.5 bg-[#18161d] text-[#a09684] hover:text-white border border-[#2b251b] rounded-xl font-semibold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer"
                >
                  {editingCustomer
                    ? lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'
                    : lang === 'ar' ? 'إضافة العميل' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121016] border border-[#3d2222] rounded-2xl shadow-2xl p-6 text-[#f2efe9] space-y-4">
            <div className="flex items-center gap-3 text-[#f28888]">
              <div className="p-2.5 bg-[#331617] rounded-xl border border-[#5c2425]">
                <Trash2 className="w-6 h-6 text-[#e03e3e]" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif-ar text-[#f0e8d8]">
                  {lang === 'ar' ? 'حذف العميل من سجل VIP' : 'Delete Member Permanently'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#c2b8a5] leading-relaxed">
              {lang === 'ar'
                ? 'هل أنت متأكد من رغبتك في حذف هذا العميل نهائياً من سجل VIP في قاعدة البيانات؟'
                : 'Are you sure you want to permanently delete this member from the VIP directory?'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCustomerId(null)}
                className="px-4 py-2 bg-[#1a1820] text-[#a09684] hover:text-white border border-[#2e2922] rounded-xl text-xs font-semibold"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deletingCustomerId)}
                className="px-5 py-2 bg-[#e03e3e] hover:bg-[#c93232] text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

