import React from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { lang, customers, formatPrice } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'سجل كبار العميلات والفرسان VIP' : 'VIP Member Directory'}
          </h1>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'إدارة الفئات الخاصة، الدعوات، ومتابعة الإنفاق التراكمي لكبار العملاء.'
              : 'Privileged directory for tier management, private invitations, and lifetime spend.'}
          </p>
        </div>
      </div>

      {/* Grid of VIP Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((cust) => (
          <div
            key={cust.id}
            className="p-6 bg-[#121116] border border-[#26221c] hover:border-[#d4af37]/60 rounded-xl shadow-lg transition duration-300"
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
            <div className="space-y-1.5 text-xs text-[#a09684]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span dir="ltr" className="inline-block font-mono text-[#f0e8d8]">{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{cust.email}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
