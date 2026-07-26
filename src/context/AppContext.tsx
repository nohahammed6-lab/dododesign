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
  OrderStatus,
  SiteSettings,
  Moderator,
  AdminPermissions
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, CURRENCY_RATES } from '../data/mockData';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc
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
  isProductsLoading: boolean;
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
  deleteOrder: (orderId: string) => void;

  customers: Customer[];
  addCustomer: (customerData: Omit<Customer, 'id' | 'joinedDate'>) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Site Contact Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (updated: Partial<SiteSettings>) => Promise<void>;

  // Moderators & Permissions
  moderators: Moderator[];
  addModerator: (modData: Omit<Moderator, 'id' | 'createdAt'>) => void;
  updateModerator: (id: string, updated: Partial<Moderator>) => void;
  deleteModerator: (id: string) => void;
  currentModerator: Moderator | null;
  setCurrentModerator: (mod: Moderator | null) => void;

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

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '01100935555',
  whatsapp: '201100935555',
  instagramHandle: 'dodoo__designs',
  instagramUrl: 'https://www.instagram.com/dodoo__designs',
  email: 'support@dododesign.shop',
};

const DEFAULT_MODERATORS: Moderator[] = [
  {
    id: 'mod-owner',
    name: 'المالك الرئيسي (Admin)',
    email: 'admin@dododesign.shop',
    pinCode: 'dododesign123',
    role: 'owner',
    permissions: {
      overview: true,
      products: true,
      orders: true,
      customers: true,
      reviews: true,
      settings: true,
      moderators: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mod-sales',
    name: 'محمود (مشرف المبيعات والطلبات)',
    email: 'sales@dododesign.shop',
    pinCode: '1234',
    role: 'moderator',
    permissions: {
      overview: true,
      products: true,
      orders: true,
      customers: false,
      reviews: true,
      settings: false,
      moderators: false,
    },
    createdAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [moderators, setModerators] = useState<Moderator[]>(() => {
    try {
      const cached = localStorage.getItem('dodo_firestore_cache_moderators');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MODERATORS;
  });

  const [currentModerator, setCurrentModerator] = useState<Moderator | null>(null);

  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem('dodo_firestore_cache_products');
      return cached === null;
    } catch {
      return true;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('dodo_firestore_cache_products');
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('dodo_firestore_cache_orders');
      if (cached !== null) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const cached = localStorage.getItem('dodo_firestore_cache_customers');
      if (cached !== null) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Firebase Firestore Realtime Sync
  useEffect(() => {
    // 1. Sync Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const stateSnap = await getDoc(doc(db, 'settings', 'store_state'));
            if (!stateSnap.exists()) {
              // Brand new database initial seed
              await setDoc(doc(db, 'settings', 'store_state'), { isInitialized: true, isCleared: false });
              for (const p of INITIAL_PRODUCTS) {
                await setDoc(doc(db, 'products', p.id), p);
              }
            } else {
              setProducts([]);
              localStorage.setItem('dodo_firestore_cache_products', JSON.stringify([]));
            }
          } catch (e) {
            console.error('Error checking store state:', e);
            setProducts([]);
          }
        } else {
          const loadedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            loadedProducts.push(docSnap.data() as Product);
          });
          setProducts(loadedProducts);
          try {
            localStorage.setItem('dodo_firestore_cache_products', JSON.stringify(loadedProducts));
          } catch (e) {
            console.error('Error saving products cache:', e);
          }
        }
        setIsProductsLoading(false);
      },
      (err) => {
        console.error('Firestore products listener error:', err);
        setIsProductsLoading(false);
      }
    );

    // 2. Sync Orders
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const stateSnap = await getDoc(doc(db, 'settings', 'store_state'));
            if (!stateSnap.exists()) {
              for (const o of INITIAL_ORDERS) {
                await setDoc(doc(db, 'orders', o.id), o);
              }
            } else {
              setOrders([]);
              localStorage.setItem('dodo_firestore_cache_orders', JSON.stringify([]));
            }
          } catch (e) {
            console.error('Error checking store state for orders:', e);
            setOrders([]);
          }
        } else {
          const loadedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            loadedOrders.push(docSnap.data() as Order);
          });
          loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loadedOrders);
          try {
            localStorage.setItem('dodo_firestore_cache_orders', JSON.stringify(loadedOrders));
          } catch (e) {
            console.error('Error saving orders cache:', e);
          }
        }
      },
      (err) => console.error('Firestore orders listener error:', err)
    );

    // 3. Sync Customers
    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const stateSnap = await getDoc(doc(db, 'settings', 'store_state'));
            if (!stateSnap.exists()) {
              for (const c of INITIAL_CUSTOMERS) {
                await setDoc(doc(db, 'customers', c.id), c);
              }
            } else {
              setCustomers([]);
              localStorage.setItem('dodo_firestore_cache_customers', JSON.stringify([]));
            }
          } catch (e) {
            console.error('Error checking store state for customers:', e);
            setCustomers([]);
          }
        } else {
          const loadedCustomers: Customer[] = [];
          snapshot.forEach((docSnap) => {
            loadedCustomers.push(docSnap.data() as Customer);
          });
          setCustomers(loadedCustomers);
          try {
            localStorage.setItem('dodo_firestore_cache_customers', JSON.stringify(loadedCustomers));
          } catch (e) {
            console.error('Error saving customers cache:', e);
          }
        }
      },
      (err) => console.error('Firestore customers listener error:', err)
    );

    // 4. Sync Site Settings
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'site_settings'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          setSiteSettings((prev) => ({ ...prev, ...data }));
        } else {
          setDoc(doc(db, 'settings', 'site_settings'), DEFAULT_SITE_SETTINGS);
        }
      },
      (err) => console.error('Firestore site_settings listener error:', err)
    );

    // 5. Sync Moderators
    const unsubModerators = onSnapshot(
      collection(db, 'moderators'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            for (const m of DEFAULT_MODERATORS) {
              await setDoc(doc(db, 'moderators', m.id), m);
            }
          } catch (e) {
            console.error('Error seeding moderators:', e);
            setModerators(DEFAULT_MODERATORS);
          }
        } else {
          const loadedMods: Moderator[] = [];
          snapshot.forEach((docSnap) => {
            loadedMods.push(docSnap.data() as Moderator);
          });
          setModerators(loadedMods);
          try {
            localStorage.setItem('dodo_firestore_cache_moderators', JSON.stringify(loadedMods));
          } catch (e) {
            console.error('Error saving moderators cache:', e);
          }
        }
      },
      (err) => console.error('Firestore moderators listener error:', err)
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubSettings();
      unsubModerators();
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
    try {
      await setDoc(doc(db, 'settings', 'store_state'), { isInitialized: true, isCleared: true });

      const prodDocs = await getDocs(collection(db, 'products'));
      for (const d of prodDocs.docs) {
        await deleteDoc(doc(db, 'products', d.id));
      }

      const orderDocs = await getDocs(collection(db, 'orders'));
      for (const d of orderDocs.docs) {
        await deleteDoc(doc(db, 'orders', d.id));
      }

      const custDocs = await getDocs(collection(db, 'customers'));
      for (const d of custDocs.docs) {
        await deleteDoc(doc(db, 'customers', d.id));
      }
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
    try {
      await setDoc(doc(db, 'settings', 'store_state'), { isInitialized: true, isCleared: false });
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
        tier: existingCustomer ? existingCustomer.tier : 'Gold VIP',
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

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      showToast(lang === 'ar' ? 'تم حذف الطلب بنجاح' : 'Order deleted successfully');
    } catch (e) {
      console.error('Error deleting order from Firestore:', e);
    }
  };

  // Customers CRUD
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'joinedDate'>) => {
    const newId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    try {
      await setDoc(doc(db, 'customers', newId), newCustomer);
      showToast(lang === 'ar' ? 'تمت إضافة العميل إلى سجل VIP بنجاح' : 'VIP Customer added successfully');
    } catch (e) {
      console.error('Error adding customer to Firestore:', e);
    }
  };

  const updateCustomer = async (id: string, updated: Partial<Customer>) => {
    const targetCustomer = customers.find((c) => c.id === id);
    if (!targetCustomer) return;

    const fullUpdated = { ...targetCustomer, ...updated };
    try {
      await setDoc(doc(db, 'customers', id), fullUpdated, { merge: true });
      showToast(lang === 'ar' ? 'تم تحديث بيانات العميل بنجاح' : 'Customer updated successfully');
    } catch (e) {
      console.error('Error updating customer in Firestore:', e);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
      showToast(lang === 'ar' ? 'تم حذف العميل من سجل VIP بنجاح' : 'Customer deleted successfully');
    } catch (e) {
      console.error('Error deleting customer from Firestore:', e);
    }
  };

  const updateSiteSettings = async (updated: Partial<SiteSettings>) => {
    const newSettings = { ...siteSettings, ...updated };
    setSiteSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'site_settings'), newSettings, { merge: true });
      showToast(lang === 'ar' ? 'تم حفظ وتحديث بيانات المتجر بنجاح' : 'Site contact settings updated successfully');
    } catch (e) {
      console.error('Error updating site settings in Firestore:', e);
    }
  };

  // Moderators CRUD
  const addModerator = async (modData: Omit<Moderator, 'id' | 'createdAt'>) => {
    const newId = `mod-${Date.now()}`;
    const newMod: Moderator = {
      ...modData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'moderators', newId), newMod);
      showToast(lang === 'ar' ? 'تمت إضافة المشرف الجديد بنجاح' : 'New moderator added successfully');
    } catch (e) {
      console.error('Error adding moderator:', e);
    }
  };

  const updateModerator = async (id: string, updated: Partial<Moderator>) => {
    const target = moderators.find((m) => m.id === id);
    if (!target) return;
    const full = { ...target, ...updated };
    try {
      await setDoc(doc(db, 'moderators', id), full, { merge: true });
      showToast(lang === 'ar' ? 'تم تحديث صلاحيات المشرف بنجاح' : 'Moderator permissions updated successfully');
    } catch (e) {
      console.error('Error updating moderator:', e);
    }
  };

  const deleteModerator = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'moderators', id));
      showToast(lang === 'ar' ? 'تم حذف المشرف بنجاح' : 'Moderator deleted successfully');
    } catch (e) {
      console.error('Error deleting moderator:', e);
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
        isProductsLoading,
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
        deleteOrder,

        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,

        siteSettings,
        updateSiteSettings,

        moderators,
        addModerator,
        updateModerator,
        deleteModerator,
        currentModerator,
        setCurrentModerator,

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
