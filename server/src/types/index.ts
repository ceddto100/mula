import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  googleId?: string;
  password?: string;
  name: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Product Types (Shopify-style)
export interface IProductVariantOption {
  name: string;
  value: string;
}

export interface IProductVariant {
  _id?: Types.ObjectId;
  sku: string;
  title?: string;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue';
  options: IProductVariantOption[];
  barcode?: string | null;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping?: boolean;
  imageUrl?: string | null;
}

export interface IProductOption {
  name: string;
  values: string[];
}

export interface IProductImage {
  _id?: Types.ObjectId;
  url: string;
  alt?: string;
  position?: number;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  // Core fields
  title: string;
  handle: string;
  status: 'draft' | 'active' | 'archived';
  vendor: string;
  productType: string;
  descriptionHtml: string;

  // Images
  images: IProductImage[];

  // Variants & Options
  variants: IProductVariant[];
  options: IProductOption[];

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

  // Shipping (product-level defaults)
  weight: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  requiresShipping: boolean;

  // Publishing
  publishedAt: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Computed helpers (virtual)
  isActive: boolean;
}

// Cart Types
export interface ICartItem {
  productId: Types.ObjectId;
  variantId?: Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

// Order Types
export interface IOrderItem {
  productId: Types.ObjectId;
  variantId?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku?: string;
}

export interface IShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Express Request Extension
// Explicitly extends Express Request to ensure all properties are recognized
export interface AuthRequest extends Request {
  user?: IUser;
  body: any;
  params: any;
  query: any;
  headers: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

// Product Filter (Shopify-style)
export interface ProductFilter {
  search?: string;
  tags?: string | string[];
  productType?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  colorFamily?: string | string[];
  size?: string | string[];
  gender?: 'men' | 'women' | 'unisex';
  fit?: 'regular' | 'oversized' | 'slim' | 'relaxed';
  collection?: string;
  status?: 'draft' | 'active' | 'archived';
}

// Create Product Input
export interface CreateProductInput {
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

// Update Product Input (partial of create)
export type UpdateProductInput = Partial<CreateProductInput>;
