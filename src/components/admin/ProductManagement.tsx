import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Trash2, Edit, Sparkles, X, Check } from 'lucide-react';
import { ProductCategory, Product } from '../../types';

export const ProductManagement: React.FC = () => {
  const { lang, products, addProduct, updateProduct, deleteProduct, formatPrice, resetStoreData, loadDemoProducts } = useApp();

  const handleResetCatalog = () => {
    resetStoreData();
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState(3500);
  const [category, setCategory] = useState<ProductCategory>('collection');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-[#566174053879-31528523f8ae]?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [sku, setSku] = useState(`DODO-ITEM-${Math.floor(100 + Math.random() * 900)}`);
  const [stock, setStock] = useState(5);
  const [sizesString, setSizesString] = useState('S, M, L, XL');
  const [colorsString, setColorsString] = useState('أسود ملكي, ذهبي ناعم');
  const [isLimited, setIsLimited] = useState(true);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setTitleAr('');
    setTitleEn('');
    setDescriptionAr('');
    setDescriptionEn('');
    setPrice(3500);
    setCategory('collection');
    setImageUrls([
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ]);
    setSku(`DODO-ITEM-${Math.floor(100 + Math.random() * 900)}`);
    setStock(6);
    setSizesString('S, M, L, XL');
    setColorsString('أسود ملكي, ذهبي ناعم, أوف وايت');
    setIsLimited(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setTitleAr(p.titleAr);
    setTitleEn(p.titleEn);
    setDescriptionAr(p.descriptionAr);
    setDescriptionEn(p.descriptionEn);
    setPrice(p.price);
    setCategory(p.category);
    setImageUrls(p.images && p.images.length > 0 ? [...p.images] : [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
    ]);
    setSku(p.sku);
    setStock(p.stock);
    setSizesString(p.sizes ? p.sizes.join(', ') : 'S, M, L, XL');
    setColorsString(p.colors ? p.colors.map(c => c.nameAr).join(', ') : 'أسود ملكي, ذهبي ناعم');
    setIsLimited(!!p.isLimitedEdition);
    setIsModalOpen(true);
  };

  const handleAddImageUrlField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const handleUpdateImageUrl = (index: number, newUrl: string) => {
    setImageUrls((prev) => {
      const updated = [...prev];
      updated[index] = newUrl;
      return updated;
    });
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = sizesString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedColors = colorsString
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
      .map((colorName) => {
        let hex = '#0a0a0c';
        if (colorName.includes('ذهبي') || colorName.includes('Gold')) hex = '#d4af37';
        else if (colorName.includes('أحمر') || colorName.includes('Red')) hex = '#8b0000';
        else if (colorName.includes('أبيض') || colorName.includes('White') || colorName.includes('أوف وايت')) hex = '#f5f5f0';
        else if (colorName.includes('كحلي') || colorName.includes('Navy') || colorName.includes('أزرق')) hex = '#1a2b4c';
        else if (colorName.includes('وردي') || colorName.includes('Pink')) hex = '#e8a5b8';
        else if (colorName.includes('اخضر') || colorName.includes('أخضر') || colorName.includes('Green')) hex = '#1b4d3e';
        return {
          nameAr: colorName,
          nameEn: colorName,
          hex,
        };
      });

    const finalColors = parsedColors.length > 0 ? parsedColors : [
      { nameAr: 'أسود ملكي', nameEn: 'Royal Black', hex: '#0a0a0c' },
      { nameAr: 'ذهبي ناعم', nameEn: 'Soft Gold', hex: '#d4af37' }
    ];

    const cleanImageUrls = imageUrls
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const finalImages = cleanImageUrls.length > 0 
      ? cleanImageUrls 
      : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'];

    const categoryNames: Record<string, { ar: string; en: string }> = {
      collection: { ar: 'تشكيلة أزياء دودو ديزاين', en: 'Dodo Design Collection' },
      dresses: { ar: 'فساتين السهرة', en: 'Evening Dresses' },
      nightwear: { ar: 'ملابس النوم الفاخرة', en: 'Luxury Nightwear' },
      accessories: { ar: 'الإكسسوارات', en: 'Accessories' },
      couture: { ar: 'الكوتور والتطريز', en: 'Haute Couture' },
      abayas: { ar: 'العباءات الملكية', en: 'Royal Abayas' },
    };

    const catName = categoryNames[category] || categoryNames.collection;

    if (editingProductId) {
      updateProduct(editingProductId, {
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        price: Number(price),
        category: 'collection',
        categoryNameAr: catName.ar,
        categoryNameEn: catName.en,
        images: finalImages,
        colors: finalColors,
        sku,
        stock: Number(stock),
        sizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L', 'XL'],
        isLimitedEdition: isLimited,
      });
    } else {
      addProduct({
        titleAr: titleAr || 'فستان راقي جديد من دودو ديزاين',
        titleEn: titleEn || 'New Dodo Design Piece',
        descriptionAr: descriptionAr || 'تصميم حصيري جديد بخياطة ممتازة.',
        descriptionEn: descriptionEn || 'New exclusive couture design.',
        price: Number(price),
        category: 'collection',
        categoryNameAr: catName.ar,
        categoryNameEn: catName.en,
        images: finalImages,
        colors: finalColors,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L', 'XL'],
        sku,
        stock: Number(stock),
        isLimitedEdition: isLimited,
        isFeatured: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23201a] pb-6">
        <div>
          <h1 className="text-2xl font-serif-ar font-bold text-[#f5f0e6]">
            {lang === 'ar' ? 'إدارة كتالوج المنتجات والكوتور' : 'Product & Collection Management'}
          </h1>
          <p className="text-xs text-[#a09684] mt-1 font-light">
            {lang === 'ar'
              ? 'إضافة قطع جديدة، تعديل الأسعار، ومتابعة المخزون المتاح في المشاغل.'
              : 'Create new bespoke items, update prices, and manage real-time inventory levels.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {products.length > 0 && (
            <button
              onClick={handleResetCatalog}
              className="px-4 py-3 bg-[#2a1717] hover:bg-[#4a1818] border border-[#6b2323] text-[#f28888] hover:text-white font-semibold text-xs rounded transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تصفير كافة المنتجات' : 'Clear All Products'}</span>
            </button>
          )}

          {products.length === 0 && (
            <button
              onClick={loadDemoProducts}
              className="px-4 py-3 bg-[#17261a] border border-[#305933] text-[#86e08c] hover:bg-[#203d24] font-semibold text-xs rounded transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'استعادة المنتجات الافتراضية' : 'Restore Demo Products'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded shadow-xl hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة قطعة جديدة' : 'Add New Item'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121116] p-4 rounded-xl border border-[#26221c]">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8c8271] absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم القطعة أو كود SKU...' : 'Search title or SKU...'}
            className="w-full bg-[#18161d] border border-[#2e2922] focus:border-[#d4af37] text-xs py-2.5 pl-9 pr-3 rtl:pr-9 rtl:pl-3 text-[#f0e8d8] rounded outline-none"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#8c8271] font-medium">{lang === 'ar' ? 'التصنيف:' : 'Category:'}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#18161d] border border-[#2e2922] text-[#d4af37] text-xs py-2 px-3 rounded focus:outline-none"
          >
            <option value="all">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
            <option value="dresses">{lang === 'ar' ? 'الفساتين' : 'Dresses'}</option>
            <option value="couture">{lang === 'ar' ? 'الكوتور' : 'Couture'}</option>
            <option value="abayas">{lang === 'ar' ? 'العباءات' : 'Abayas'}</option>
            <option value="nightwear">{lang === 'ar' ? 'ملابس النوم' : 'Nightwear'}</option>
            <option value="accessories">{lang === 'ar' ? 'الإكسسوارات' : 'Accessories'}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 bg-[#121116] border border-[#26221c] rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-[#26221c] text-[#d4af37] font-semibold uppercase">
                <th className="py-3 px-3">{lang === 'ar' ? 'القطعة' : 'Product'}</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المقاسات المتاحة' : 'Sizes'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'السعر (EGP)' : 'Price (EGP)'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المخزون' : 'Stock'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'حالة التوفر' : 'Availability'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1a21] text-[#c4bbb0]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const title = lang === 'ar' ? p.titleAr : p.titleEn;
                  return (
                    <tr key={p.id} className="hover:bg-[#18161d] transition">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={title} className="w-10 h-12 object-cover rounded bg-[#1a1820]" />
                          <div>
                            <span className="font-semibold text-[#f5f0e6] block line-clamp-1">{title}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-[#918571] font-mono">
                                ({p.images?.length || 1} {lang === 'ar' ? 'صور' : 'photos'})
                              </span>
                              {p.isLimitedEdition && (
                                <span className="text-[10px] text-[#d4af37] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  {lang === 'ar' ? 'إصدار محدود' : 'Limited Edition'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#a09684]">{p.sku}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 flex-wrap max-w-[150px]">
                          {p.sizes && p.sizes.map((sz) => (
                            <span key={sz} className="px-1.5 py-0.5 bg-[#1b1922] border border-[#332d22] text-[#d4af37] rounded text-[10px] font-mono">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-serif-en font-bold text-gold-gradient">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#f0e8d8]">
                        <span className="px-2 py-1 bg-[#18161f] border border-[#302a20] rounded font-mono">
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            p.stock > 3
                              ? 'bg-[#1b381d] text-[#7de385] border border-[#2b6130]'
                              : p.stock > 0
                              ? 'bg-[#3b2d13] text-[#e0b253] border border-[#634a1b]'
                              : 'bg-[#3d1818] text-[#f28888] border border-[#6e2222]'
                          }`}
                        >
                          {p.stock > 3 && (lang === 'ar' ? 'متوفر' : 'In Stock')}
                          {p.stock <= 3 && p.stock > 0 && (lang === 'ar' ? 'مخزون منخفض' : 'Low Stock')}
                          {p.stock === 0 && (lang === 'ar' ? 'نفد من المخزون' : 'Out of Stock')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-[#1e1c24] text-[#d4af37] hover:bg-[#d4af37] hover:text-black rounded transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 bg-[#261616] text-[#e05252] hover:bg-[#e05252] hover:text-white rounded transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#a09684]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Sparkles className="w-8 h-8 text-[#d4af37] opacity-60" />
                      <p className="text-sm font-serif-ar font-medium text-[#e8dfd0]">
                        {lang === 'ar'
                          ? 'المتجر نقي بدون منتجات حالياً. ابدأ بإضافة أول قطعة من الزر بالأعلى!'
                          : 'No products in catalog. Click "Add New Item" above to add your first product!'}
                      </p>
                      <button
                        onClick={handleOpenAddModal}
                        className="mt-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase rounded shadow hover:brightness-110 transition cursor-pointer"
                      >
                        {lang === 'ar' ? 'إضافة أول قطعة الآن' : 'Add First Item Now'}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0f0e12] border border-[#2d2922] rounded-xl shadow-2xl p-6 sm:p-8 text-[#f2efe9] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#23201a] mb-6">
              <h3 className="text-lg font-serif-ar font-bold text-[#f5f0e6]">
                {editingProductId
                  ? (lang === 'ar' ? 'تعديل بيانات القطعة' : 'Edit Product Details')
                  : (lang === 'ar' ? 'إضافة قطعة كوتور جديدة' : 'Add New Couture Product')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-[#a09684] hover:text-[#d4af37]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'اسم القطعة (بالعربية)' : 'Arabic Title'}</label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'اسم القطعة (بالإنجليزية)' : 'English Title'}</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'السعر (بالجنيه المصري EGP)' : 'Price (EGP)'}</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#a09684] mb-1">{lang === 'ar' ? 'الكمية المتاحة بالمخزون' : 'Available Stock'}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#f0e8d8] outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#a09684] mb-1">
                    {lang === 'ar' ? 'المقاسات المتاحة (مفصولة بفواصل)' : 'Available Sizes (comma separated)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={sizesString}
                    onChange={(e) => setSizesString(e.target.value)}
                    placeholder="S, M, L, XL, Free Size"
                    className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#d4af37] outline-none font-mono"
                  />
                  <p className="text-[10px] text-[#807666] mt-1">
                    {lang === 'ar' ? 'مثال: S, M, L, XL أو Free Size' : 'e.g. S, M, L, XL or Free Size'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-[#a09684] mb-1">
                    {lang === 'ar' ? 'ألوان المنتج المتاحة (مفصولة بفواصل)' : 'Product Colors (comma separated)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={colorsString}
                    onChange={(e) => setColorsString(e.target.value)}
                    placeholder="أسود ملكي, ذهبي ناعم, أوف وايت"
                    className="w-full bg-[#16151b] border border-[#2e2922] focus:border-[#d4af37] text-xs p-3 rounded text-[#e0d6c3] outline-none"
                  />
                  <p className="text-[10px] text-[#807666] mt-1">
                    {lang === 'ar' ? 'مثال: أسود ملكي, ذهبي ناعم, كحلي, أوف وايت' : 'e.g. Royal Black, Soft Gold, White'}
                  </p>
                </div>
              </div>

              {/* Multiple Product Images Section */}
              <div className="space-y-3 bg-[#16151b] border border-[#2e2922] p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#d4af37]">
                      {lang === 'ar' ? 'معرض صور القطعة (ألبوم الصور)' : 'Product Image Gallery'}
                    </label>
                    <p className="text-[11px] text-[#807666] mt-0.5">
                      {lang === 'ar' ? 'يمكنك إضافة عدة صور ليتم عرضها كألبوم تفاعلي عندما يفتح العميل تفاصيل القطعة' : 'Add multiple image URLs for client gallery carousel'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddImageUrlField}
                    className="flex items-center gap-1 text-[11px] font-bold text-black bg-[#d4af37] hover:bg-[#e5c158] px-2.5 py-1 rounded transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إضافة صورة' : 'Add Image'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-10 h-12 bg-[#0c0b0f] border border-[#2e2922] rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {url.trim() ? (
                          <img
                            src={url}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-[10px] text-[#554e43] font-mono">#{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] text-[#a09684] font-semibold">
                            {idx === 0 
                              ? (lang === 'ar' ? 'الصورة الرئيسية (الواجهة)' : 'Main Cover Photo') 
                              : (lang === 'ar' ? `صورة إضافية #${idx + 1}` : `Gallery Image #${idx + 1}`)}
                          </span>
                        </div>
                        <input
                          type="url"
                          required={idx === 0}
                          value={url}
                          onChange={(e) => handleUpdateImageUrl(idx, e.target.value)}
                          placeholder={lang === 'ar' ? 'ضع رابط الصورة هنا (HTTPS)...' : 'Image URL (https://...)'}
                          className="w-full bg-[#0c0b0f] border border-[#2e2922] focus:border-[#d4af37] text-xs px-3 py-1.5 rounded text-[#f0e8d8] outline-none"
                        />
                      </div>

                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(idx)}
                          className="p-2 text-rose-400 hover:bg-rose-900/30 rounded transition cursor-pointer self-end mb-0.5"
                          title={lang === 'ar' ? 'حذف هذه الصورة' : 'Remove image'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="limitedCheck"
                  checked={isLimited}
                  onChange={(e) => setIsLimited(e.target.checked)}
                  className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="limitedCheck" className="text-xs text-[#f0e8d8] cursor-pointer">
                  {lang === 'ar' ? 'تعليم كإصدار محدود فاخر (Limited Edition)' : 'Mark as Limited Edition'}
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 transition"
              >
                {lang === 'ar' ? 'حفظ القطعة بالمخزون' : 'Save Product to System'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
