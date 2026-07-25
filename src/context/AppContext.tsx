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

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const isReset = localStorage.getItem('dodo_store_reset');
      const saved = localStorage.getItem('dodo_products');
      if (saved) return JSON.parse(saved);
      if (isReset === 'true') return [];
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const isReset = localStorage.getItem('dodo_store_reset');
      const saved = localStorage.getItem('dodo_orders');
      if (saved) return JSON.parse(saved);
      if (isReset === 'true') return [];
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const isReset = localStorage.getItem('dodo_store_reset');
      const saved = localStorage.getItem('dodo_customers');
      if (saved) return JSON.parse(saved);
      if (isReset === 'true') return [];
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dodo_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Persist orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dodo_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Persist customers to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dodo_customers', JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers to localStorage', e);
    }
  }, [customers]);

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

  const addReviewToProduct = (productId: string, userName: string, rating: number, comment: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newReview = {
          id: `rev-${Date.now()}`,
          userName: userName || (lang === 'ar' ? 'عميلة تم التحقق منها' : 'Verified Client'),
          rating,
          comment,
          date: new Date().toISOString().split('T')[0],
        };
        const existingReviews = p.reviews || [];
        const updatedReviews = [newReview, ...existingReviews];
        const newReviewsCount = updatedReviews.length;
        const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = parseFloat((totalRatingSum / newReviewsCount).toFixed(1));

        return {
          ...p,
          rating: newAverageRating,
          reviewsCount: newReviewsCount,
          reviews: updatedReviews,
        };
      })
    );
    showToast(lang === 'ar' ? 'شكراً لتقييمك! تم إضافته بنجاح' : 'Thank you for your rating!');
  };

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setViewMode('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 5.0,
      reviewsCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(lang === 'ar' ? 'تمت إضافة القطعة بنجاح إلى المعرض' : 'Product successfully added to collection');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast(lang === 'ar' ? 'تم تحديث بيانات القطعة' : 'Product details updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(lang === 'ar' ? 'تم حذف القطعة من النظام' : 'Product removed from system');
  };

  // Reset all data for clean fresh start
  const resetStoreData = () => {
    setProducts([]);
    setOrders([]);
    setCustomers([]);
    setCart([]);
    try {
      localStorage.setItem('dodo_products', JSON.stringify([]));
      localStorage.setItem('dodo_orders', JSON.stringify([]));
      localStorage.setItem('dodo_customers', JSON.stringify([]));
      localStorage.setItem('dodo_store_reset', 'true');
    } catch (e) {
      console.error(e);
    }
    showToast(
      lang === 'ar'
        ? 'تم تصفير جميع البيانات! (المبيعات: 0 ج.م - الطلبات: 0 - العملاء: 0 - المنتجات: 0)'
        : 'All data reset! (Sales: 0 EGP - Orders: 0 - Customers: 0 - Products: 0)'
    );
  };

  const loadDemoProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    try {
      localStorage.setItem('dodo_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('dodo_orders', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('dodo_customers', JSON.stringify(INITIAL_CUSTOMERS));
      localStorage.removeItem('dodo_store_reset');
    } catch (e) {
      console.error(e);
    }
    showToast(
      lang === 'ar'
        ? 'تمت استعادة العينات والمنتجات الافتراضية بنجاح'
        : 'Demo sample products restored successfully'
    );
  };

  // Orders CRUD
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(lang === 'ar' ? `تم تسجيل طلبك بنجاح رقم #${newId}` : `Order #${newId} placed successfully`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
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
