export type Language = 'ar' | 'en';

export type Currency = 'EGP';

export type ProductCategory = 'collection';

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved?: boolean;
  productId?: string;
  productTitleAr?: string;
  productTitleEn?: string;
}

export interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number; // Price in EGP (ج.م)
  category: ProductCategory;
  categoryNameAr: string;
  categoryNameEn: string;
  images: string[];
  isLimitedEdition?: boolean;
  isTopSelling?: boolean;
  isFeatured?: boolean;
  colors: ProductColor[];
  sizes: string[];
  sku: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  careInstructionsAr?: string;
  careInstructionsEn?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerEmail: string;
  items: {
    productId: string;
    productTitleAr: string;
    productTitleEn: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  currency: Currency;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: 'Royal VIP' | 'Gold VIP' | 'Silver VIP';
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

export type ViewMode = 'store' | 'product_detail' | 'admin';
export type AdminTab = 'overview' | 'products' | 'orders' | 'customers';
