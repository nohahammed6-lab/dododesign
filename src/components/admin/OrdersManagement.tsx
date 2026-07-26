import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Eye, Filter, CheckCircle, Truck, Clock, XCircle, Trash2, User, Phone, MapPin, CreditCard, ShoppingBag, Calendar, Check, Layers, LayoutList } from 'lucide-react';
import { OrderStatus, Order } from '../../types';
import { ColorSwatch } from '../ColorSwatch';

export const OrdersManagement: React.FC = () => {
  const { lang, orders, updateOrderStatus, deleteOrder, formatPrice } = useApp();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'detailed' | 'table'>('detailed');

  // Selected Order for Modal View & Delete Confirmation
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
    setDeletingOrderId(null);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.customerCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'إدارة طلبات الحجوزات والشحن' : 'Bookings & Orders Management'}
            </h1>
            <span className="px-2.5 py-0.5 bg-[#1f1a14] border border-[#d4af37]/60 text-[#d4af37] text-[10px] font-bold rounded-full">
              {orders.length} {lang === 'ar' ? 'حجز' : 'Bookings'}
            </span>
          </div>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'عرض بيانات الحجوزات كاملة مع تفاصيل القطع والألوان والأعداد المختارة مباشرة.'
              : 'View complete booking details, customer information, and ordered quantities directly.'}
          </p>
        </div>

        {/* View Switcher: Detailed Cards vs Compact Table */}
        <div className="flex items-center gap-1 bg-[#141218] p-1 rounded-xl border border-[#2d271f]">
          <button
            onClick={() => setViewLayout('detailed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewLayout === 'detailed'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#a09684] hover:text-[#f0e8d8]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'عرض تفصيلي كامل' : 'Detailed Cards'}</span>
          </button>

          <button
            onClick={() => setViewLayout('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewLayout === 'table'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#a09684] hover:text-[#f0e8d8]'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'جدول مختصر' : 'Compact Table'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[#121116] p-4 rounded-xl border border-[#26221c]">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all', nameAr: 'جميع الحجوزات', nameEn: 'All Orders' },
            { key: 'processing', nameAr: 'قيد المعالجة', nameEn: 'Processing' },
            { key: 'shipped', nameAr: 'تم الشحن', nameEn: 'Shipped' },
            { key: 'delivered', nameAr: 'تم التسليم', nameEn: 'Delivered' },
            { key: 'cancelled', nameAr: 'ملغى', nameEn: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold shadow-md'
                  : 'bg-[#18161d] text-[#c4bbb0] border border-[#2e2922] hover:border-[#d4af37]/50'
              }`}
            >
              {lang === 'ar' ? tab.nameAr : tab.nameEn}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8c8271] absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث برقم الطلب، الاسم، الهاتف...' : 'Search ID, Name, Phone...'}
            className="w-full bg-[#18161d] border border-[#2e2922] focus:border-[#d4af37] text-xs py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-[#f0e8d8] rounded-xl outline-none"
          />
        </div>

      </div>

      {/* DETAILED CARDS VIEW (ALL BOOKING DATA VISIBLE DIRECTLY) */}
      {viewLayout === 'detailed' ? (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#121116] border border-[#26221c] rounded-2xl text-[#8c8271]">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#d4af37]" />
              <p className="text-sm font-semibold">{lang === 'ar' ? 'لا توجد طلبات حجوزات تطابق البحث' : 'No booking orders match search'}</p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#121116] border border-[#29241d] hover:border-[#3d3426] rounded-2xl p-5 shadow-xl transition space-y-4"
              >
                {/* Order Top Bar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23201a] pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-[#1e1a14] border border-[#d4af37]/50 text-[#d4af37] font-mono font-bold text-xs rounded-lg">
                      {ord.id}
                    </span>
                    <span className="text-xs text-[#8c8271] flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      {new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#8c8271] font-semibold">{lang === 'ar' ? 'حالة الشحن:' : 'Status:'}</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold py-1 px-3 rounded-lg border outline-none cursor-pointer ${
                          ord.status === 'delivered'
                            ? 'bg-[#1b381d] text-[#7de385] border-[#2b6130]'
                            : ord.status === 'shipped'
                            ? 'bg-[#1a2d3d] text-[#6cb5f2] border-[#224b6d]'
                            : ord.status === 'processing'
                            ? 'bg-[#3b2d13] text-[#e0b253] border-[#634a1b]'
                            : 'bg-[#3d1818] text-[#f28888] border-[#6e2222]'
                        }`}
                      >
                        <option value="processing" className="bg-[#121116] text-white">{lang === 'ar' ? '⏳ قيد المعالجة' : 'Processing'}</option>
                        <option value="shipped" className="bg-[#121116] text-white">{lang === 'ar' ? '🚚 تم الشحن' : 'Shipped'}</option>
                        <option value="delivered" className="bg-[#121116] text-white">{lang === 'ar' ? '✅ تم التسليم' : 'Delivered'}</option>
                        <option value="cancelled" className="bg-[#121116] text-white">{lang === 'ar' ? '❌ ملغى' : 'Cancelled'}</option>
                      </select>
                    </div>

                    {/* Delete Action Button */}
                    <button
                      onClick={() => setDeletingOrderId(ord.id)}
                      className="p-1.5 bg-[#2b1718] text-[#f28888] hover:bg-[#e03e3e] hover:text-white border border-[#522020] rounded-lg transition cursor-pointer"
                      title={lang === 'ar' ? 'حذف الطلب' : 'Delete Order'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Customer Booking Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#18161d] p-3.5 rounded-xl border border-[#24201a] text-xs">
                  
                  {/* Customer Name */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-[#211c14] border border-[#d4af37]/30 text-[#d4af37] rounded-lg mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8c8271] uppercase font-bold block">{lang === 'ar' ? 'اسم العميلة / الحجز' : 'Customer Name'}</span>
                      <span className="font-bold text-[#f5f0e6] text-xs block">{ord.customerName}</span>
                    </div>
                  </div>

                  {/* Customer Phone */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-[#211c14] border border-[#d4af37]/30 text-[#d4af37] rounded-lg mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8c8271] uppercase font-bold block">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</span>
                      <span dir="ltr" className="font-mono font-bold text-[#d4af37] text-xs block text-left rtl:text-right">{ord.customerPhone}</span>
                    </div>
                  </div>

                  {/* Address & City */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-[#211c14] border border-[#d4af37]/30 text-[#d4af37] rounded-lg mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8c8271] uppercase font-bold block">{lang === 'ar' ? 'المدينة والعنوان' : 'City & Address'}</span>
                      <span className="font-semibold text-[#e0d6c3] text-xs block">{ord.customerCity} - {ord.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-[#211c14] border border-[#d4af37]/30 text-[#d4af37] rounded-lg mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8c8271] uppercase font-bold block">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
                      <span className="font-bold text-[#7de385] text-xs block">{ord.paymentMethod}</span>
                    </div>
                  </div>

                </div>

                {/* Ordered Items List (FULL ITEMS DETAILS WITH COLOR & QUANTITY) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-[#d4af37] flex items-center gap-1.5 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تفاصيل القطع والحجوزات المطلوبة:' : 'Ordered Items & Quantities:'}</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {ord.items.map((item, idx) => {
                      const itemColor = item.selectedColor || {
                        nameAr: item.color || 'الأسود الملكي',
                        nameEn: item.color || 'Royal Black',
                        hex: '#0a0a0a',
                      };
                      return (
                        <div
                          key={idx}
                          className="bg-[#18161d] p-3 rounded-xl border border-[#2b251d] flex items-center gap-3"
                        >
                          {/* Image Thumbnail */}
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productTitleAr}
                              className="w-14 h-16 object-cover rounded-lg border border-[#383023] flex-shrink-0"
                            />
                          )}

                          <div className="flex-1 min-w-0 space-y-1 text-xs">
                            <h4 className="font-bold text-[#f5f0e6] truncate">
                              {lang === 'ar' ? item.productTitleAr : item.productTitleEn}
                            </h4>

                            {/* Color Swatch & Size */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-[11px] text-[#c7beaf]">
                                <span>{lang === 'ar' ? 'اللون:' : 'Color:'}</span>
                                <ColorSwatch
                                  color={{
                                    nameAr: itemColor.nameAr,
                                    nameEn: itemColor.nameEn,
                                    hex: itemColor.hex || '#0a0a0a',
                                  }}
                                  size="xs"
                                  showTitle={true}
                                  lang={lang}
                                />
                              </div>

                              <span className="text-[10px] bg-[#242018] border border-[#3d3322] px-2 py-0.5 rounded text-[#e0d6c3] font-bold">
                                المقاس: {item.size}
                              </span>
                            </div>

                            {/* Quantity Highlight */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#23201a]">
                              <span className="px-2 py-0.5 bg-[#292212] border border-[#d4af37]/60 text-[#d4af37] text-[11px] font-bold rounded-md">
                                {lang === 'ar' ? `${item.quantity} قطعة` : `Qty: ${item.quantity}`}
                              </span>
                              <span className="font-serif-en font-bold text-gold-gradient text-xs">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Summary Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#23201a] bg-[#100f13] p-3 rounded-xl">
                  <div className="text-xs text-[#8c8271]">
                    {lang === 'ar' ? 'عدد القطع الإجمالي:' : 'Total Items:'}{' '}
                    <span className="font-bold text-[#f5f0e6]">
                      {ord.items.reduce((sum, i) => sum + i.quantity, 0)} {lang === 'ar' ? 'قطعة' : 'pcs'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#a09684] font-semibold">{lang === 'ar' ? 'إجمالي الحجز:' : 'Booking Total:'}</span>
                    <span className="font-serif-en font-bold text-gold-gradient text-base">
                      {formatPrice(ord.totalAmount)}
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      ) : (
        /* COMPACT TABLE VIEW */
        <div className="p-6 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-[#26221c] text-[#d4af37] font-semibold uppercase">
                  <th className="py-3 px-3">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'تاريخ الطلب' : 'Date'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'العميلة' : 'Customer'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'المدينة' : 'City'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'القطع والأعداد' : 'Items & Qty'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  <th className="py-3 px-3">{lang === 'ar' ? 'حالة الشحن' : 'Status'}</th>
                  <th className="py-3 px-3 text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1a21] text-[#c4bbb0]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#18161d] transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#f0e8d8]">{ord.id}</td>
                    <td className="py-3.5 px-3 text-[#a09684]">
                      {new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#f5f0e6]">{ord.customerName}</td>
                    <td className="py-3.5 px-3 font-mono text-[#d4af37]" dir="ltr">{ord.customerPhone}</td>
                    <td className="py-3.5 px-3">{ord.customerCity}</td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        {ord.items.map((it, i) => {
                          const colorName = it.selectedColor
                            ? (lang === 'ar' ? it.selectedColor.nameAr : it.selectedColor.nameEn)
                            : (it.color || 'الأسود الملكي');
                          return (
                            <div key={i} className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-[#d4af37]">{it.quantity}×</span>
                              <span>{lang === 'ar' ? it.productTitleAr : it.productTitleEn}</span>
                              <span className="text-[10px] text-[#8c8271]">({colorName}, {it.size})</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-serif-en font-bold text-gold-gradient">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#18161d] border border-[#2e2922] text-[#d4af37] text-[11px] py-1 px-2 rounded focus:outline-none cursor-pointer font-bold"
                      >
                        <option value="processing">{lang === 'ar' ? 'قيد المعالجة' : 'Processing'}</option>
                        <option value="shipped">{lang === 'ar' ? 'تم الشحن' : 'Shipped'}</option>
                        <option value="delivered">{lang === 'ar' ? 'تم التسليم' : 'Delivered'}</option>
                        <option value="cancelled">{lang === 'ar' ? 'إلغاء الطلب' : 'Cancelled'}</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 bg-[#1d1b22] text-[#d4af37] hover:bg-[#d4af37] hover:text-black rounded transition cursor-pointer"
                          title={lang === 'ar' ? 'معاينة نافذة' : 'View Modal'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingOrderId(ord.id)}
                          className="p-1.5 bg-[#2a1718] text-[#f28888] hover:bg-[#e03e3e] hover:text-white border border-[#522020] rounded transition cursor-pointer"
                          title={lang === 'ar' ? 'حذف الطلب' : 'Delete Order'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121016] border border-[#3d2222] rounded-2xl shadow-2xl p-6 text-[#f2efe9] space-y-4">
            <div className="flex items-center gap-3 text-[#f28888]">
              <div className="p-2.5 bg-[#331617] rounded-xl border border-[#5c2425]">
                <Trash2 className="w-6 h-6 text-[#e03e3e]" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif-ar text-[#f0e8d8]">
                  {lang === 'ar' ? 'حذف الطلب نهائياً' : 'Delete Order Permanently'}
                </h3>
                <p className="text-xs text-[#a09684] mt-0.5 font-mono">{deletingOrderId}</p>
              </div>
            </div>

            <p className="text-xs text-[#c2b8a5] leading-relaxed">
              {lang === 'ar'
                ? 'هل أنت متأكد من رغبتك في حذف هذا الطلب بشكل نهائي من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to permanently delete this order? This action cannot be undone.'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-4 py-2 bg-[#1a1820] text-[#a09684] hover:text-white border border-[#2e2922] rounded-xl text-xs font-semibold"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deletingOrderId)}
                className="px-5 py-2 bg-[#e03e3e] hover:bg-[#c93232] text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl p-6 text-[#f2efe9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#23201a] mb-4">
              <h3 className="text-base font-serif-ar font-bold text-[#f5f0e6]">
                {lang === 'ar' ? `تفاصيل الحجز الملكي ${selectedOrder.id}` : `Booking Details ${selectedOrder.id}`}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#a09684] hover:text-[#d4af37]">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#a09684] mb-6">
              <p><strong className="text-[#f0e8d8]">{lang === 'ar' ? 'العميلة:' : 'Customer:'}</strong> {selectedOrder.customerName}</p>
              <p><strong className="text-[#f0e8d8]">{lang === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</strong> <span dir="ltr" className="inline-block font-mono text-[#f0e8d8]">{selectedOrder.customerPhone}</span></p>
              <p><strong className="text-[#f0e8d8]">{lang === 'ar' ? 'العنوان:' : 'Address:'}</strong> {selectedOrder.shippingAddress}</p>
              <p><strong className="text-[#f0e8d8]">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</strong> {selectedOrder.paymentMethod}</p>

              <div className="pt-3 border-t border-[#23201a]">
                <h4 className="font-semibold text-[#d4af37] mb-2">{lang === 'ar' ? 'القطع المطلوبة:' : 'Ordered Items:'}</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#16151b] rounded border border-[#26221c]">
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#f0e8d8]">
                          {lang === 'ar' ? item.productTitleAr : item.productTitleEn}
                        </div>
                        <div className="text-[11px] text-[#8c8271] flex items-center gap-2">
                          <span>المقاس: {item.size}</span>
                          <span className="text-[#d4af37] font-bold">العدد: {item.quantity} قطعة</span>
                        </div>
                      </div>
                      <span className="text-[#f0e8d8] font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#f5f0e6] pt-3 border-t border-[#23201a]">
                <span>{lang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                <span className="text-gold-gradient font-serif-en">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingOrderId(selectedOrder.id)}
                className="px-4 py-2.5 bg-[#2b1718] text-[#f28888] hover:bg-[#e03e3e] hover:text-white border border-[#522020] rounded font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حذف الطلب' : 'Delete Order'}</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 bg-[#26231c] text-[#d4af37] border border-[#3d372b] rounded font-semibold text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق المعاينة' : 'Close View'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
