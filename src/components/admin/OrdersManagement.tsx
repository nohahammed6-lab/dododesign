import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Eye, Filter, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { OrderStatus, Order } from '../../types';

export const OrdersManagement: React.FC = () => {
  const { lang, orders, updateOrderStatus, formatPrice } = useApp();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'إدارة الطلبات والشحن الملكي' : 'Orders & Dispatch Management'}
          </h1>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'متابعة وتحديث حالات الشحن والتحضير للطلبات الملكية المباشرة.'
              : 'Process inbound orders, handle concierge fulfillment, and update shipment statuses.'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[#121116] p-4 rounded-xl border border-[#26221c]">
        
        {/* Status Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all', nameAr: 'جميع الطلبات', nameEn: 'All Orders' },
            { key: 'processing', nameAr: 'قيد المعالجة', nameEn: 'Processing' },
            { key: 'shipped', nameAr: 'تم الشحن', nameEn: 'Shipped' },
            { key: 'delivered', nameAr: 'تم التسليم', nameEn: 'Delivered' },
            { key: 'cancelled', nameAr: 'ملغى', nameEn: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-4 py-2 rounded text-xs font-semibold transition ${
                statusFilter === tab.key
                  ? 'bg-[#d4af37] text-black shadow-md'
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
            placeholder={lang === 'ar' ? 'ابحث برقم الطلب أو الاسم...' : 'Search Order ID or Name...'}
            className="w-full bg-[#18161d] border border-[#2e2922] focus:border-[#d4af37] text-xs py-2 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-[#f0e8d8] rounded outline-none"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="p-6 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-[#26221c] text-[#d4af37] font-semibold uppercase">
                <th className="py-3 px-3">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'تاريخ الطلب' : 'Date'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'العميلة' : 'Customer'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المدينة' : 'City'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'حالة الشحن' : 'Status'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'تحديث الحالة' : 'Update Status'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'معاينة' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1a21] text-[#c4bbb0]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#18161d] transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#f0e8d8]">{ord.id}</td>
                  <td className="py-3.5 px-3 text-[#a09684]">
                    {new Date(ord.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#f5f0e6]">
                    <div>{ord.customerName}</div>
                    <span dir="ltr" className="text-[10px] text-[#8c8271] font-mono inline-block">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-3">{ord.customerCity}</td>
                  <td className="py-3.5 px-3 font-serif-en font-bold text-gold-gradient">
                    {formatPrice(ord.totalAmount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        ord.status === 'delivered'
                          ? 'bg-[#1b381d] text-[#7de385] border border-[#2b6130]'
                          : ord.status === 'shipped'
                          ? 'bg-[#1a2d3d] text-[#6cb5f2] border border-[#224b6d]'
                          : ord.status === 'processing'
                          ? 'bg-[#3b2d13] text-[#e0b253] border border-[#634a1b]'
                          : 'bg-[#3d1818] text-[#f28888] border border-[#6e2222]'
                      }`}
                    >
                      {ord.status === 'delivered' && (lang === 'ar' ? 'تم التسليم' : 'Delivered')}
                      {ord.status === 'shipped' && (lang === 'ar' ? 'تم الشحن' : 'Shipped')}
                      {ord.status === 'processing' && (lang === 'ar' ? 'قيد المعالجة' : 'Processing')}
                      {ord.status === 'cancelled' && (lang === 'ar' ? 'ملغى' : 'Cancelled')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-[#18161d] border border-[#2e2922] text-[#d4af37] text-[11px] py-1 px-2 rounded focus:outline-none cursor-pointer"
                    >
                      <option value="processing">{lang === 'ar' ? 'قيد المعالجة' : 'Processing'}</option>
                      <option value="shipped">{lang === 'ar' ? 'تم الشحن' : 'Shipped'}</option>
                      <option value="delivered">{lang === 'ar' ? 'تم التسليم' : 'Delivered'}</option>
                      <option value="cancelled">{lang === 'ar' ? 'إلغاء الطلب' : 'Cancelled'}</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 bg-[#1d1b22] text-[#d4af37] hover:bg-[#d4af37] hover:text-black rounded transition"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl p-6 text-[#f2efe9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#23201a] mb-4">
              <h3 className="text-base font-serif-ar font-bold text-[#f5f0e6]">
                {lang === 'ar' ? `تفاصيل الطلب الملكي ${selectedOrder.id}` : `Order Details ${selectedOrder.id}`}
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
                    <div key={idx} className="flex justify-between p-2 bg-[#16151b] rounded border border-[#26221c]">
                      <span>{lang === 'ar' ? item.productTitleAr : item.productTitleEn} ({item.size})</span>
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

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-[#26231c] text-[#d4af37] border border-[#3d372b] rounded font-semibold text-xs"
            >
              {lang === 'ar' ? 'إغلاق المعاينة' : 'Close View'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
