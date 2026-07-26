import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Currency,
  Product,
  CartItem,
  Order,
  Customer,
  ViewMode,
  AdminTab,
  ProductCategory,
  ProductColor,
  OrderStatus
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, CURRENCY_RATES } from '../data/mockData';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

interface AppContextType {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInSAR: number) => string;

  // View Navigation
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openProductDetail: (id: string) => void;

  // Data Collections
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReviewToProduct: (productId: string, userName: string, rating: number, comment: string) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  toggleApproveReview: (productId: string, reviewId: string) => void;
  resetStoreData: () => void;
  loadDemoProducts: () => void;

  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  customers: Customer[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color: ProductColor, size: string, quantity?: number, openCart?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Storefront Filter
  activeCategory: ProductCategory | 'all';
  setActiveCategory: (category: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & Overlays
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Firebase Firestore Realtime Sync
  useEffect(() => {
    // 1. Sync Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (snapshot.empty) {
          const isReset = localStorage.getItem('dodo_store_reset');
          if (isReset !== 'true') {
            INITIAL_PRODUCTS.forEach((p) => {
              setDoc(doc(db, 'products', p.id), p);
            });
          } else {
            setProducts([]);
          }
        } else {
          const loadedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            loadedProducts.push(docSnap.data() as Product);
          });
          setProducts(loadedProducts);
        }
      },
      (err) => console.error('Firestore products listener error:', err)
    );

    // 2. Sync Orders
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (snapshot.empty) {
          const isReset = localStorage.getItem('dodo_store_reset');
          if (isReset !== 'true') {
            INITIAL_ORDERS.forEach((o) => {
              setDoc(doc(db, 'orders', o.id), o);
            });
          } else {
            setOrders([]);
          }
        } else {
          const loadedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            loadedOrders.push(docSnap.data() as Order);
          });
          loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loadedOrders);
        }
      },
      (err) => console.error('Firestore orders listener error:', err)
    );

    // 3. Sync Customers
    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      (snapshot) => {
        if (snapshot.empty) {
          const isReset = localStorage.getItem('dodo_store_reset');
          if (isReset !== 'true') {
            INITIAL_CUSTOMERS.forEach((c) => {
              setDoc(doc(db, 'customers', c.id), c);
            });
          } else {
            setCustomers([]);
          }
        } else {
          const loadedCustomers: Customer[] = [];
          snapshot.forEach((docSnap) => {
            loadedCustomers.push(docSnap.data() as Customer);
          });
          setCustomers(loadedCustomers);
        }
      },
      (err) => console.error('Firestore customers listener error:', err)
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
    };
  }, []);

  // URL hash / parameter listener for direct Admin access
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const path = window.location.pathname;
      if (hash === '#admin' || search.includes('admin=true') || path.endsWith('/admin')) {
        setViewMode('admin');
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  // Sync hash when viewMode changes
  useEffect(() => {
    if (viewMode === 'admin') {
      if (window.location.hash !== '#admin') {
        window.location.hash = '#admin';
      }
    } else if (viewMode === 'store' && window.location.hash === '#admin') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, [viewMode]);

  // Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize HTML document direction with language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const formatPrice = (priceInEGP: number): string => {
    const formattedNum = Math.round(priceInEGP).toLocaleString();
    return lang === 'ar' ? `${formattedNum} ج.م` : `${formattedNum} EGP`;
  };

  const addReviewToProduct = async (productId: string, userName: string, rating: number, comment: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      userName: userName || (lang === 'ar' ? 'عميلة تم التحقق منها' : 'Verified Client'),
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      isApproved: true,
      productId,
      productTitleAr: targetProduct.titleAr,
      productTitleEn: targetProduct.titleEn,
    };

    const existingReviews = targetProduct.reviews || [];
    const updatedReviews = [newReview, ...existingReviews];
    const newReviewsCount = updatedReviews.length;
    const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = parseFloat((totalRatingSum / newReviewsCount).toFixed(1));

    const updatedProduct = {
      ...targetProduct,
      rating: newAverageRating,
      reviewsCount: newReviewsCount,
      reviews: updatedReviews,
    };

    try {
      await setDoc(doc(db, 'products', productId), updatedProduct, { merge: true });
      showToast(lang === 'ar' ? 'شكراً لتقييمك! تم إضافته بنجاح' : 'Thank you for your rating!');
    } catch (e) {
      console.error('Error saving review to Firestore:', e);
    }
  };

  const deleteReview = async (productId: string, reviewId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const currentReviews = targetProduct.reviews || [];
    const updatedReviews = currentReviews.filter((r) => r.id !== reviewId);
    const newReviewsCount = updatedReviews.length;
    const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = newReviewsCount > 0 ? parseFloat((totalRatingSum / newReviewsCount).toFixed(1)) : 5.0;

    const updatedProduct = {
      ...targetProduct,
      rating: newAverageRating,
      reviewsCount: newReviewsCount,
      reviews: updatedReviews,
    };

    try {
      await setDoc(doc(db, 'products', productId), updatedProduct, { merge: true });
      showToast(lang === 'ar' ? 'تم حذف التقييم بنجاح' : 'Review deleted successfully');
    } catch (e) {
      console.error('Error deleting review from Firestore:', e);
    }
  };

  const toggleApproveReview = async (productId: string, reviewId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const currentReviews = targetProduct.reviews || [];
    const updatedReviews = currentReviews.map((r) =>
      r.id === reviewId ? { ...r, isApproved: r.isApproved === false ? true : false } : r
    );

    const updatedProduct = {
      ...targetProduct,
      reviews: updatedReviews,
    };

    try {
      await setDoc(doc(db, 'products', productId), updatedProduct, { merge: true });
      showToast(lang === 'ar' ? 'تم تغيير حالة التقييم' : 'Review approval status updated');
    } catch (e) {
      console.error('Error toggling review in Firestore:', e);
    }
  };

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setViewMode('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
    };
    try {
      await setDoc(doc(db, 'products', newId), newProduct);
      showToast(lang === 'ar' ? 'تمت إضافة القطعة بنجاح إلى المعرض' : 'Product successfully added to collection');
    } catch (e) {
      console.error('Error adding product to Firestore:', e);
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    const fullUpdatedProduct = { ...targetProduct, ...updated };
    try {
      await setDoc(doc(db, 'products', id), fullUpdatedProduct, { merge: true });
      showToast(lang === 'ar' ? 'تم تحديث بيانات القطعة' : 'Product details updated');
    } catch (e) {
      console.error('Error updating product in Firestore:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      showToast(lang === 'ar' ? 'تم حذف القطعة من النظام' : 'Product removed from system');
    } catch (e) {
      console.error('Error deleting product from Firestore:', e);
    }
  };

  // Reset all data for clean fresh start
  const resetStoreData = async () => {
    localStorage.setItem('dodo_store_reset', 'true');
    try {
      const prodDocs = await getDocs(collection(db, 'products'));
      prodDocs.forEach((d) => deleteDoc(doc(db, 'products', d.id)));

      const orderDocs = await getDocs(collection(db, 'orders'));
      orderDocs.forEach((d) => deleteDoc(doc(db, 'orders', d.id)));

      const custDocs = await getDocs(collection(db, 'customers'));
      custDocs.forEach((d) => deleteDoc(doc(db, 'customers', d.id)));
    } catch (e) {
      console.error('Error resetting Firestore store data:', e);
    }
    setProducts([]);
    setOrders([]);
    setCustomers([]);
    setCart([]);
    showToast(
      lang === 'ar'
        ? 'تم تصفير جميع البيانات نهائياً في قاعدة البيانات الحية!'
        : 'All store data cleared from live database!'
    );
  };

  const loadDemoProducts = async () => {
    localStorage.removeItem('dodo_store_reset');
    try {
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      for (const o of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
      for (const c of INITIAL_CUSTOMERS) {
        await setDoc(doc(db, 'customers', c.id), c);
      }
      showToast(
        lang === 'ar'
          ? 'تمت استعادة العينات والمنتجات الافتراضية بنجاح'
          : 'Demo sample products restored successfully'
      );
    } catch (e) {
      console.error('Error loading demo products into Firestore:', e);
    }
  };

  // Orders CRUD
  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', newId), newOrder);

      // Customer Sync
      const existingCustomer = customers.find((c) => c.phone === orderData.customerPhone);
      const customerId = existingCustomer ? existingCustomer.id : `cust-${Date.now()}`;
      const newCustomer: Customer = {
        id: customerId,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        city: orderData.customerCity,
        totalOrders: (existingCustomer?.totalOrders || 0) + 1,
        totalSpent: (existingCustomer?.totalSpent || 0) + orderData.totalAmount,
        tier: ((existingCustomer?.totalSpent || 0) + orderData.totalAmount) > 10000 ? 'Royal VIP' : 'Gold VIP',
        joinedDate: existingCustomer?.joinedDate || new Date().toISOString().split('T')[0],
      };
      await setDoc(doc(db, 'customers', customerId), newCustomer);

      clearCart();
      setIsCheckoutOpen(false);
      showToast(lang === 'ar' ? `تم تسجيل طلبك بنجاح رقم #${newId}` : `Order #${newId} placed successfully`);
    } catch (e) {
      console.error('Error saving order to Firestore:', e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    try {
      await setDoc(doc(db, 'orders', orderId), { ...targetOrder, status }, { merge: true });
      showToast(lang === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
    } catch (e) {
      console.error('Error updating order status in Firestore:', e);
    }
  };

  // Cart Logic
  const addToCart = (product: Product, selectedColor: ProductColor, selectedSize: string, quantity = 1, openCart = false) => {
    const cartItemId = `${product.id}-${selectedColor.hex}-${selectedSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedColor,
          selectedSize,
          quantity,
        },
      ];
    });
    if (openCart) {
      setIsCartOpen(true);
    }
    showToast(lang === 'ar' ? `تمت إضافة ${product.titleAr} إلى حقيبة التسوق` : `${product.titleEn} added to shopping bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(lang === 'ar' ? 'تمت إزالة القطعة من قائمة الأمنيات' : 'Item removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(lang === 'ar' ? 'تمت إضافة القطعة إلى قائمة الأمنيات' : 'Item added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        formatPrice,

        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        selectedProductId,
        setSelectedProductId,
        openProductDetail,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        addReviewToProduct,
        deleteReview,
        toggleApproveReview,
        resetStoreData,
        loadDemoProducts,

        orders,
        addOrder,
        updateOrderStatus,

        customers,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        wishlist,
        toggleWishlist,
        isInWishlist,

        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,

        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
