// User Types
export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
}

// Product Types (Shopify-style)
export interface ProductVariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  _id?: string;
  sku: string;
  title?: string;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue';
  options: ProductVariantOption[];
  barcode?: string | null;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping?: boolean;
  imageUrl?: string | null;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  position?: number;
}

export interface Product {
  _id: string;
  // Core fields
  title: string;
  handle: string;
  status: 'draft' | 'active' | 'archived';
  vendor: string;
  productType: string;
  descriptionHtml: string;

  // Images
  images: ProductImage[];

  // Variants & Options
  variants: ProductVariant[];
  options: ProductOption[];

  // SEO
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  collections: string[];
  metaKeywords: string[];

  // Filtering
  gender: 'men' | 'women' | 'unisex' | null;
  fit: 'regular' | 'oversized' | 'slim' | 'relaxed' | null;
  materials: string[];
  colorFamily: string[];

  // Shipping
  weight: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping: boolean;

  // Publishing
  publishedAt: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Computed fields (from API)
  isActive?: boolean;
  priceRange?: { min: number; max: number };
  totalInventory?: number;
  inStock?: boolean;
  seo?: ProductSEO;
}

export interface ProductSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  image: string | null;
  imageAlt: string;
}

// Create/Update Product Data
export interface CreateProductData {
  title: string;
  handle?: string;
  status?: 'draft' | 'active' | 'archived';
  vendor?: string;
  productType?: string;
  descriptionHtml?: string;
  images?: Array<{ url: string; alt?: string; position?: number }>;
  variants: Array<{
    sku: string;
    title?: string;
    price: number;
    compareAtPrice?: number | null;
    inventoryQuantity?: number;
    inventoryPolicy?: 'deny' | 'continue';
    options?: Array<{ name: string; value: string }>;
    barcode?: string | null;
    weight?: number;
    weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
    requiresShipping?: boolean;
    imageUrl?: string | null;
  }>;
  options?: Array<{ name: string; values: string[] }>;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  collections?: string[];
  metaKeywords?: string[];
  gender?: 'men' | 'women' | 'unisex' | null;
  fit?: 'regular' | 'oversized' | 'slim' | 'relaxed' | null;
  materials?: string[];
  colorFamily?: string[];
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping?: boolean;
}

export type UpdateProductData = Partial<CreateProductData>;


export interface HomePageImages {
  _id?: string;
  heroImage: string;
  menImage: string;
  womenImage: string;
  collectionImage: string;
  accessoryImage: string;
  saleImage: string;
}

export interface CategoryHeroMedia {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  subtitle: string;
}

export interface CategoryHeroConfig {
  _id?: string;
  men: CategoryHeroMedia;
  women: CategoryHeroMedia;
  denim: CategoryHeroMedia;
  sale: CategoryHeroMedia;
  hoodies: CategoryHeroMedia;
  all: CategoryHeroMedia;
}

export interface HeroContent {
  badge: string;
  headline1: string;
  headline2: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollLabel: string;
}

export interface CategoryCardContent {
  badge?: string;
  title: string;
  description?: string;
  linkText: string;
}

export interface ShopByStyleContent {
  sectionTitle: string;
  men: CategoryCardContent;
  women: CategoryCardContent;
  accessories: CategoryCardContent;
  sale: CategoryCardContent;
  collections: CategoryCardContent;
}

export interface FreshDropsContent {
  badge: string;
  sectionTitle: string;
  viewAllLink: string;
}

export interface BrandStatementContent {
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaButton: string;
}

export interface NewsletterContent {
  title: string;
  description: string;
  emailPlaceholder: string;
  submitButton: string;
}

export interface BrandThemeContent {
  accentColor: string;
  heroOverlayEnabled: boolean;
  heroOverlayColor: string;
  headingFont: string;
}

export interface HomePageContent {
  _id?: string;
  hero: HeroContent;
  shopByStyle: ShopByStyleContent;
  freshDrops: FreshDropsContent;
  brandStatement: BrandStatementContent;
  newsletter: NewsletterContent;
  brandTheme: BrandThemeContent;
}

// Cart Types
export interface CartItem {
  _id: string;
  productId: Product;
  variantId?: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  activeProducts?: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
  avgOrderValue: number;
  recentOrders: Order[];
  lowStockProducts: Array<{ title?: string; name?: string; sku?: string; stock: number }>;
}

// Filter Options
export interface ProductFilterOptions {
  productTypes: string[];
  vendors: string[];
  collections: string[];
  tags: string[];
  genders: string[];
  fits: string[];
  colorFamilies: string[];
  priceRange: { minPrice: number; maxPrice: number };
}
