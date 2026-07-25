import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { lang, isSizeGuideOpen, setIsSizeGuideOpen } = useApp();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl text-[#f2efe9] overflow-hidden p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#23201a] mb-6">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Ruler className="w-5 h-5" />
            <h2 className="text-lg font-serif-ar font-bold text-[#f5f0e6]">
              {lang === 'ar' ? 'دليل المقاسات الملكية' : 'Royal Size Guide'}
            </h2>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-[#a09684] hover:text-[#d4af37] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-[#2a261e] text-[#d4af37] font-semibold uppercase">
                <th className="py-3 px-2">{lang === 'ar' ? 'المقاس' : 'Size'}</th>
                <th className="py-3 px-2">{lang === 'ar' ? 'الصدر (سم)' : 'Bust (cm)'}</th>
                <th className="py-3 px-2">{lang === 'ar' ? 'الخصر (سم)' : 'Waist (cm)'}</th>
                <th className="py-3 px-2">{lang === 'ar' ? 'الأوراك (سم)' : 'Hips (cm)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1d17] text-[#c2b9a7]">
              <tr>
                <td className="py-3 px-2 font-bold text-[#f0e8d8]">XS / 34</td>
                <td className="py-3 px-2">82 - 85</td>
                <td className="py-3 px-2">62 - 65</td>
                <td className="py-3 px-2">88 - 91</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-bold text-[#f0e8d8]">S / 36</td>
                <td className="py-3 px-2">86 - 89</td>
                <td className="py-3 px-2">66 - 69</td>
                <td className="py-3 px-2">92 - 95</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-bold text-[#f0e8d8]">M / 38</td>
                <td className="py-3 px-2">90 - 93</td>
                <td className="py-3 px-2">70 - 73</td>
                <td className="py-3 px-2">96 - 99</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-bold text-[#f0e8d8]">L / 40</td>
                <td className="py-3 px-2">94 - 98</td>
                <td className="py-3 px-2">74 - 78</td>
                <td className="py-3 px-2">100 - 104</td>
              </tr>
              <tr>
                <td className="py-3 px-2 font-bold text-[#f0e8d8]">XL / 42</td>
                <td className="py-3 px-2">99 - 104</td>
                <td className="py-3 px-2">79 - 84</td>
                <td className="py-3 px-2">105 - 110</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#8c8271] font-light leading-relaxed">
          {lang === 'ar'
            ? 'تنبيه: جميع تصاميم دودو ديزاين تُخاط وفق قياسات الهوت كوتور العالمية. للمقاسات الخاصة والمخصصة كلياً، يمكن التواصل مباشرة مع الخياط الخاص.'
            : 'Note: All garments follow international bespoke couture standards. Contact our concierge for custom tailoring measurements.'}
        </p>

      </div>
    </div>
  );
};
