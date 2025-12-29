import mongoose, { Schema, Document, Types } from 'mongoose';

// Sub-schemas for the Shopify-style product

// Option definition (e.g., { name: "Size", values: ["S", "M", "L"] })
const optionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  values: [{
    type: String,
    trim: true,
  }],
}, { _id: false });

// Variant option (e.g., { name: "Size", value: "M" })
const variantOptionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

// Product variant schema
const variantSchema = new Schema({
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative'],
    default: null,
  },
  inventoryQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Inventory cannot be negative'],
  },
  inventoryPolicy: {
    type: String,
    enum: ['deny', 'continue'],
    default: 'deny',
  },
  options: [variantOptionSchema],
  barcode: {
    type: String,
    trim: true,
    default: null,
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: 0,
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'oz'],
    default: 'kg',
  },
  requiresShipping: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
}, { _id: true });

// Image with alt text
const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
    trim: true,
  },
  position: {
    type: Number,
    default: 0,
  },
}, { _id: true });

// Main product interface
export interface IProductVariant {
  _id?: Types.ObjectId;
  sku: string;
  title?: string;
  price: number;
  compareAtPrice?: number | null;
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue';
  options: Array<{ name: string; value: string }>;
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

  // Computed helpers
  isActive: boolean; // Virtual for backward compatibility
}

const productSchema = new Schema<IProduct>(
  {
    // Core fields
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [256, 'Title cannot exceed 256 characters'],
    },
    handle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Handle must be a valid URL slug'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    vendor: {
      type: String,
      trim: true,
      default: '',
    },
    productType: {
      type: String,
      trim: true,
      default: '',
    },
    descriptionHtml: {
      type: String,
      default: '',
    },

    // Images
    images: [imageSchema],

    // Variants & Options
    variants: {
      type: [variantSchema],
      validate: {
        validator: function(variants: IProductVariant[]) {
          return variants && variants.length > 0;
        },
        message: 'Product must have at least one variant',
      },
    },
    options: [optionSchema],

    // SEO
    seoTitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [70, 'SEO title should not exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [160, 'SEO description should not exceed 160 characters'],
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    collections: [{
      type: String,
      trim: true,
    }],
    metaKeywords: [{
      type: String,
      trim: true,
      lowercase: true,
    }],

    // Filtering
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', null],
      default: null,
    },
    fit: {
      type: String,
      enum: ['regular', 'oversized', 'slim', 'relaxed', null],
      default: null,
    },
    materials: [{
      type: String,
      trim: true,
    }],
    colorFamily: [{
      type: String,
      trim: true,
    }],

    // Shipping defaults
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight cannot be negative'],
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg',
    },
    requiresShipping: {
      type: Boolean,
      default: true,
    },

    // Publishing
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ handle: 1 }, { unique: true });
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
productSchema.index({
  title: 'text',
  descriptionHtml: 'text',
  tags: 'text',
  seoTitle: 'text',
  seoDescription: 'text',
  vendor: 'text',
});
productSchema.index({ status: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ fit: 1 });
productSchema.index({ colorFamily: 1 });
productSchema.index({ collections: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ publishedAt: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'variants.price': 1 });

// Virtual for backward compatibility
productSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Pre-save hook to set publishedAt when status changes to active
productSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'active' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }
  next();
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
