import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight, PackageCheck, Clock, CheckCircle2 } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { lang, products, orders, customers, formatPrice, resetStoreData, loadDemoProducts } = useApp();

  const handleReset = () => {
    resetStoreData();
  };

  const totalSalesSAR = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter((o) => o.status === 'processing' || o.status === 'shipped');
  const vipClientsCount = customers.length;
  const avgOrderValueSAR = orders.length > 0 ? totalSalesSAR / orders.length : 0;

  // Mock weekly sales chart heights
  const weeklyData = [
    { dayAr: 'السبت', dayEn: 'Sat', val: 65 },
    { dayAr: 'الأحد', dayEn: 'Sun', val: 80 },
    { dayAr: 'الإثنين', dayEn: 'Mon', val: 45 },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', val: 95 },
    { dayAr: 'الأربعاء', dayEn: 'Wed', val: 110 },
    { dayAr: 'الخميس', dayEn: 'Thu', val: 140 },
    { dayAr: 'الجمعة', dayEn: 'Fri', val: 125 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'نظرة عامة على النظام والدار' : 'Atelier Overview & Analytics'}
          </h1>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'متابعة المبيعات المباشرة، الطلبات النشطة، وإحصائيات كبار العملاء VIP.'
              : 'Real-time monitoring of high-fashion sales, active orders, and VIP member activity.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-[#261515] hover:bg-[#4a1818] border border-[#6b2323] text-[#f58e8e] hover:text-white rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="Reset All Data"
          >
            <span>{lang === 'ar' ? 'تصفير بيانات المتجر (بدء متجر جديد)' : 'Reset All Store Data'}</span>
          </button>
          {products.length === 0 && (
            <button
              onClick={loadDemoProducts}
              className="px-3.5 py-1.5 bg-[#1b261c] hover:bg-[#253b27] border border-[#305933] text-[#86e08c] rounded text-xs font-semibold transition cursor-pointer"
            >
              <span>{lang === 'ar' ? 'استعادة العينات الافتراضية' : 'Restore Demo Data'}</span>
            </button>
          )}
          <div className="px-3 py-1.5 bg-[#17161b] border border-[#d4af37]/40 rounded text-xs text-[#d4af37] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#82c974] animate-ping"></span>
            <span>{lang === 'ar' ? 'النظام متصل ومحدث مباشر' : 'Live System Online'}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="p-5 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg hover:border-[#d4af37]/50 transition">
          <div className="flex items-center justify-between text-[#d4af37] mb-3">
            <span className="text-xs font-serif-ar uppercase tracking-wider">{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
            <div className="p-2 bg-[#1d1b22] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif-en font-bold text-gold-gradient mb-1">
            {formatPrice(totalSalesSAR)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#82c974]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% {lang === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month'}</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="p-5 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg hover:border-[#d4af37]/50 transition">
          <div className="flex items-center justify-between text-[#d4af37] mb-3">
            <span className="text-xs font-serif-ar uppercase tracking-wider">{lang === 'ar' ? 'الطلبات النشطة' : 'Active Orders'}</span>
            <div className="p-2 bg-[#1d1b22] rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif-en font-bold text-[#f5f0e6] mb-1">
            {activeOrders.length} {lang === 'ar' ? 'طلب' : 'orders'}
          </div>
          <div className="text-[11px] text-[#a09684]">
            {lang === 'ar' ? '8 طلبات جاري التغليف الملكي' : '8 awaiting packaging'}
          </div>
        </div>

        {/* VIP Customers */}
        <div className="p-5 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg hover:border-[#d4af37]/50 transition">
          <div className="flex items-center justify-between text-[#d4af37] mb-3">
            <span className="text-xs font-serif-ar uppercase tracking-wider">{lang === 'ar' ? 'كبار العملاء VIP' : 'VIP Members'}</span>
            <div className="p-2 bg-[#1d1b22] rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif-en font-bold text-[#f5f0e6] mb-1">
            {vipClientsCount}
          </div>
          <div className="text-[11px] text-[#a09684]">
            {lang === 'ar' ? 'جميعهم من الفئة الملكية والذهبية' : 'Royal & Gold tier accounts'}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg hover:border-[#d4af37]/50 transition">
          <div className="flex items-center justify-between text-[#d4af37] mb-3">
            <span className="text-xs font-serif-ar uppercase tracking-wider">{lang === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</span>
            <div className="p-2 bg-[#1d1b22] rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif-en font-bold text-gold-gradient mb-1">
            {formatPrice(avgOrderValueSAR)}
          </div>
          <div className="text-[11px] text-[#82c974]">
            {lang === 'ar' ? 'فئة الهوت كوتور الفاخرة' : 'Couture benchmark'}
          </div>
        </div>

      </div>

      {/* Visual Sales Performance Bar Chart */}
      <div className="p-6 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'مبيعات الأسبوع الحالي' : 'Weekly Sales Performance'}
            </h3>
            <p className="text-xs text-[#a09684]">{lang === 'ar' ? 'توزيع المبيعات بالآلاف حسب الأيام' : 'Revenue distribution by day (in Thousands)'}</p>
          </div>
          <span className="text-xs text-[#d4af37] font-semibold bg-[#1a1820] px-3 py-1 rounded border border-[#383226]">
            {lang === 'ar' ? 'الأسبوع 29 - 2026' : 'Week 29 - 2026'}
          </span>
        </div>

        {/* Bars Container */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2 border-b border-[#23201a]">
          {weeklyData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-[#1e1c24] rounded-t-sm relative flex items-end overflow-hidden h-36">
                <div
                  className="w-full bg-gradient-to-t from-[#aa771c] via-[#d4af37] to-[#fceabb] group-hover:brightness-125 transition-all duration-500 rounded-t-sm"
                  style={{ height: `${(d.val / 150) * 100}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-[#a09684] group-hover:text-[#d4af37] transition font-medium">
                {lang === 'ar' ? d.dayAr : d.dayEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table Overview */}
      <div className="p-6 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6 border-b border-[#23201a] pb-4">
          <h3 className="text-base font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'أحدث الطلبات الواردة' : 'Recent Inbound Orders'}
          </h3>
          <span className="text-xs text-[#a09684]">{lang === 'ar' ? 'إجمالي 4 طلبات حديثة' : 'Showing latest 4 orders'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-[#26221c] text-[#d4af37] font-semibold uppercase">
                <th className="py-3 px-3">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'اسم العميلة' : 'Customer'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المدينة' : 'City'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1a21] text-[#c4bbb0]">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#18161d] transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#f0e8d8]">{ord.id}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#f5f0e6]">{ord.customerName}</td>
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
                  <td className="py-3.5 px-3 text-[#a09684]">{ord.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
