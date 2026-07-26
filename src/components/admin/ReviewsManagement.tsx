import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductReview, Product } from '../../types';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  Info
} from 'lucide-react';

export const ReviewsManagement: React.FC = () => {
  const { lang, products, deleteReview, toggleApproveReview, addReviewToProduct, openProductDetail, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [selectedProductIdFilter, setSelectedProductIdFilter] = useState<string>('all');

  // Modal for adding a new manual review from Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductId, setNewProductId] = useState<string>(products[0]?.id || '');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');

  // Collect all reviews across all products with attached product info
  const allReviews: (ProductReview & { productId: string; productTitleAr: string; productTitleEn: string; productImage: string })[] = [];

  products.forEach((product) => {
    if (product.reviews && product.reviews.length > 0) {
      product.reviews.forEach((review) => {
        allReviews.push({
          ...review,
          productId: product.id,
          productTitleAr: product.titleAr,
          productTitleEn: product.titleEn,
          productImage: product.images[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=200',
        });
      });
    }
  });

  // Calculate statistics
  const totalReviewsCount = allReviews.length;
  const approvedReviewsCount = allReviews.filter((r) => r.isApproved !== false).length;
  const hiddenReviewsCount = allReviews.filter((r) => r.isApproved === false).length;
  const averageStoreRating = totalReviewsCount > 0 
    ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  // Filter logic
  const filteredReviews = allReviews.filter((review) => {
    const title = lang === 'ar' ? review.productTitleAr : review.productTitleEn;
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = selectedRatingFilter === 'all' || review.rating === selectedRatingFilter;

    const isApproved = review.isApproved !== false;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'approved' && isApproved) ||
      (statusFilter === 'hidden' && !isApproved);

    const matchesProduct = selectedProductIdFilter === 'all' || review.productId === selectedProductIdFilter;

    return matchesSearch && matchesRating && matchesStatus && matchesProduct;
  });

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductId) {
      showToast(lang === 'ar' ? 'يرجى اختيار المنتج' : 'Please select a product');
      return;
    }
    if (!newComment.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة التقييم' : 'Please enter a review comment');
      return;
    }

    addReviewToProduct(
      newProductId,
      newCustomerName.trim() || (lang === 'ar' ? 'عميلة متميزة' : 'VIP Client'),
      newRating,
      newComment.trim()
    );

    setIsAddModalOpen(false);
    setNewCustomerName('');
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111015] border border-[#26221c] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#1d1b22] border border-[#d4af37]/40 text-[#d4af37] rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif-ar text-gold-gradient">
                {lang === 'ar' ? 'إدارة التقييمات وآراء العملاء' : 'Customer Reviews & Feedback Management'}
              </h2>
              <p className="text-xs text-[#a39783] mt-0.5">
                {lang === 'ar' ? 'متابعة، اعتماد، حذف، وإضافة تقييمات العملاء لمنتجات المعرض' : 'Monitor, approve, remove, and curate client product reviews'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة تقييم جديد يدويًا' : 'Add Manual Review'}</span>
        </button>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111015] border border-[#26221c] p-4 rounded-xl space-y-1">
          <span className="text-xs text-[#9c8e78] font-medium block">
            {lang === 'ar' ? 'إجمالي التقييمات' : 'Total Reviews'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-[#f2efe9]">{totalReviewsCount}</span>
            <MessageSquare className="w-5 h-5 text-[#d4af37]" />
          </div>
        </div>

        <div className="bg-[#111015] border border-[#26221c] p-4 rounded-xl space-y-1">
          <span className="text-xs text-[#9c8e78] font-medium block">
            {lang === 'ar' ? 'متوسط تقييم الكتالوج' : 'Average Catalog Rating'}
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#f2efe9]">{averageStoreRating}</span>
              <span className="text-xs text-[#d4af37]">/ 5.0</span>
            </div>
            <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
          </div>
        </div>

        <div className="bg-[#111015] border border-[#26221c] p-4 rounded-xl space-y-1">
          <span className="text-xs text-[#9c8e78] font-medium block">
            {lang === 'ar' ? 'تقييمات معتمدة وظاهرة' : 'Approved Reviews'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{approvedReviewsCount}</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#111015] border border-[#26221c] p-4 rounded-xl space-y-1">
          <span className="text-xs text-[#9c8e78] font-medium block">
            {lang === 'ar' ? 'تقييمات مخفية' : 'Hidden Reviews'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">{hiddenReviewsCount}</span>
            <XCircle className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-[#111015] border border-[#26221c] p-4 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a7f6c] absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث باسم العميلة، نص التقييم، أو اسم المنتج...' : 'Search customer name, review, or product title...'}
              className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs text-[#f2efe9] rounded-lg pl-9 rtl:pr-9 rtl:pl-3 py-2.5 outline-none transition"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#18161d] border border-[#2d2820] p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                statusFilter === 'all'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a39783] hover:text-[#f2efe9]'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'} ({totalReviewsCount})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                statusFilter === 'approved'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-[#a39783] hover:text-[#f2efe9]'
              }`}
            >
              {lang === 'ar' ? 'المعتمدة' : 'Approved'} ({approvedReviewsCount})
            </button>
            <button
              onClick={() => setStatusFilter('hidden')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                statusFilter === 'hidden'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-[#a39783] hover:text-[#f2efe9]'
              }`}
            >
              {lang === 'ar' ? 'المخفية' : 'Hidden'} ({hiddenReviewsCount})
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#231f18]">
          {/* Rating filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#a39783]">
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{lang === 'ar' ? 'تصفية حسب النجوم:' : 'Stars Filter:'}</span>
            <select
              value={selectedRatingFilter}
              onChange={(e) => setSelectedRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-[#18161d] border border-[#2d2820] text-xs text-[#f2efe9] rounded px-2.5 py-1 outline-none focus:border-[#d4af37]"
            >
              <option value="all">{lang === 'ar' ? 'كل التقييمات' : 'All Stars'}</option>
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#a39783]">
            <span>{lang === 'ar' ? 'المنتج:' : 'Product:'}</span>
            <select
              value={selectedProductIdFilter}
              onChange={(e) => setSelectedProductIdFilter(e.target.value)}
              className="bg-[#18161d] border border-[#2d2820] text-xs text-[#f2efe9] rounded px-2.5 py-1 outline-none focus:border-[#d4af37] max-w-[200px] truncate"
            >
              <option value="all">{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'ar' ? p.titleAr : p.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="rtl:mr-auto ltr:ml-auto text-[11px] text-[#827562] font-mono">
            {lang === 'ar' ? `يعرض ${filteredReviews.length} من إجمالي ${totalReviewsCount}` : `Showing ${filteredReviews.length} of ${totalReviewsCount}`}
          </div>
        </div>
      </div>

      {/* Reviews Table / Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-[#111015] border border-[#26221c] p-12 rounded-2xl text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-[#3b352b] mx-auto" />
          <p className="text-sm font-semibold text-[#a39783]">
            {lang === 'ar' ? 'لا توجد تقييمات مطابقة لهذه الفلاتر' : 'No reviews matched these filters'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRatingFilter('all');
              setStatusFilter('all');
              setSelectedProductIdFilter('all');
            }}
            className="px-4 py-2 bg-[#1c1a21] border border-[#383023] hover:border-[#d4af37] text-xs text-[#d4af37] rounded-lg transition"
          >
            {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => {
            const isApproved = review.isApproved !== false;

            return (
              <div
                key={`${review.productId}-${review.id}`}
                className={`bg-[#111015] border rounded-xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isApproved 
                    ? 'border-[#26221c] hover:border-[#3d3423]' 
                    : 'border-amber-900/40 bg-[#16120e]/80'
                }`}
              >
                {/* Customer & Product Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={review.productImage}
                    alt={review.productTitleAr}
                    className="w-14 h-16 object-cover rounded-lg border border-[#2d2820] flex-shrink-0 cursor-pointer"
                    onClick={() => openProductDetail(review.productId)}
                  />

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#f2efe9]">{review.userName}</span>
                      <span className="text-[11px] text-[#8c7e68] font-mono">• {review.date}</span>

                      {/* Status Tag */}
                      {isApproved ? (
                        <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 text-[10px] font-semibold rounded-full flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          {lang === 'ar' ? 'معتمد ومباشر' : 'Approved'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-800/50 text-amber-400 text-[10px] font-semibold rounded-full flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" />
                          {lang === 'ar' ? 'مخفي' : 'Hidden'}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? 'text-[#d4af37] fill-[#d4af37]'
                              : 'text-[#332e27]'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-mono font-bold text-[#d4af37] rtl:mr-1 ltr:ml-1">
                        ({review.rating}/5)
                      </span>
                    </div>

                    {/* Review Comment Text */}
                    <p className="text-xs text-[#dcd7cb] bg-[#17151c] border border-[#26221c] p-2.5 rounded-lg leading-relaxed">
                      "{review.comment}"
                    </p>

                    {/* Product Name Link */}
                    <div className="flex items-center gap-1 text-[11px] text-[#9e917d]">
                      <span>{lang === 'ar' ? 'على قطعة:' : 'On product:'}</span>
                      <button
                        onClick={() => openProductDetail(review.productId)}
                        className="text-[#d4af37] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>{lang === 'ar' ? review.productTitleAr : review.productTitleEn}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions Button Group */}
                <div className="flex items-center gap-2 border-t md:border-t-0 border-[#231f18] pt-3 md:pt-0 justify-end flex-shrink-0">
                  <button
                    onClick={() => toggleApproveReview(review.productId, review.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      isApproved
                        ? 'bg-[#1e1c24] border border-[#3b3425] text-amber-400 hover:border-amber-400'
                        : 'bg-emerald-950 border border-emerald-700 text-emerald-400 hover:bg-emerald-900'
                    }`}
                    title={isApproved ? (lang === 'ar' ? 'إخفاء التقييم من المتجر' : 'Hide from store') : (lang === 'ar' ? 'إظهار التقييم بالمتجر' : 'Show in store')}
                  >
                    {isApproved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{isApproved ? (lang === 'ar' ? 'إخفاء' : 'Hide') : (lang === 'ar' ? 'اعتماد وإظهار' : 'Approve')}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) {
                        deleteReview(review.productId, review.id);
                      }
                    }}
                    className="p-2 bg-[#211618] border border-rose-900/40 text-rose-400 hover:bg-rose-900 hover:text-white rounded-lg transition cursor-pointer"
                    title={lang === 'ar' ? 'حذف التقييم نهائياً' : 'Delete review'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Manual Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111015] border border-[#383023] w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#26221c] pb-3">
              <h3 className="font-bold text-base font-serif-ar text-gold-gradient flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'إضافة تقييم جديد لقطعة' : 'Add New Product Review'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#998b76] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-xs">
              {/* Product Selection */}
              <div>
                <label className="block text-[#b5a792] mb-1 font-semibold">
                  {lang === 'ar' ? 'اختر القطعة المراد تقييمها:' : 'Select Product:'}
                </label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs text-[#f2efe9] rounded-lg p-2.5 outline-none"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {lang === 'ar' ? p.titleAr : p.titleEn} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-[#b5a792] mb-1 font-semibold">
                  {lang === 'ar' ? 'اسم العميلة / صاحبة التقييم:' : 'Customer Name:'}
                </label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الأميرة سارة آل سعود' : 'e.g. Princess Sara'}
                  className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs text-[#f2efe9] rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-[#b5a792] mb-1 font-semibold">
                  {lang === 'ar' ? 'التقييم (عدد النجوم):' : 'Rating (Stars):'}
                </label>
                <div className="flex items-center gap-2 bg-[#18161d] border border-[#2d2820] p-2 rounded-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating
                            ? 'text-[#d4af37] fill-[#d4af37]'
                            : 'text-[#363028]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono font-bold text-sm text-[#d4af37] rtl:mr-auto ltr:ml-auto">
                    {newRating} / 5
                  </span>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="block text-[#b5a792] mb-1 font-semibold">
                  {lang === 'ar' ? 'نص التقييم والملاحظات:' : 'Review Comment:'}
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder={lang === 'ar' ? 'كتبت العميلة رأيها الفخم هنا...' : 'Write review text here...'}
                  className="w-full bg-[#18161d] border border-[#2d2820] focus:border-[#d4af37] text-xs text-[#f2efe9] rounded-lg p-2.5 outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#26221c]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#1b1921] text-[#a39783] hover:text-white rounded-lg transition"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa771c] text-black font-bold rounded-lg shadow hover:brightness-110 transition"
                >
                  {lang === 'ar' ? 'حفظ ونشر التقييم' : 'Save & Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
