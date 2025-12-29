import { Request, Response } from 'express';
import { Express } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import { AuthRequest, CreateProductInput, UpdateProductInput } from '../types';
import { cloudinary } from '../config/cloudinary';
import {
  generateUniqueHandle,
  slugify,
  generateSeoTitle,
  generateSeoDescription,
  getPriceRange,
  getTotalInventory,
} from '../utils/product.utils';

// Dashboard stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      lowStockProducts,
      orderStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find()
        .sort('-createdAt')
        .limit(5)
        .populate('userId', 'name email'),
      // Find products with low stock variants
      Product.aggregate([
        { $match: { status: 'active' } },
        { $unwind: '$variants' },
        { $match: { 'variants.inventoryQuantity': { $lt: 10 } } },
        { $project: { title: 1, sku: '$variants.sku', stock: '$variants.inventoryQuantity' } },
        { $limit: 10 },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalUsers,
        recentOrders,
        lowStockProducts,
        revenue: orderStats[0]?.totalRevenue || 0,
        avgOrderValue: orderStats[0]?.avgOrderValue || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard stats',
    });
  }
};

// Create product (Shopify-style)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: CreateProductInput = req.body;

    // Generate handle if not provided
    const handle = productData.handle || await generateUniqueHandle(productData.title);

    // Generate SEO fields if not provided
    const seoTitle = productData.seoTitle || generateSeoTitle(productData.title);
    const seoDescription = productData.seoDescription ||
      (productData.descriptionHtml ? generateSeoDescription(productData.descriptionHtml) : '');

    // Set publishedAt if status is active
    const publishedAt = productData.status === 'active' ? new Date() : null;

    const product = await Product.create({
      ...productData,
      handle,
      seoTitle,
      seoDescription,
      publishedAt,
      status: productData.status || 'draft',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    // Handle duplicate key error for handle
    if (error.code === 11000) {
      if (error.keyPattern?.handle) {
        res.status(400).json({
          success: false,
          message: 'A product with this handle already exists',
        });
        return;
      }
      if (error.keyPattern?.['variants.sku']) {
        res.status(400).json({
          success: false,
          message: 'A variant with this SKU already exists',
        });
        return;
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateProductInput = req.body;

    // If title is being updated and handle is not provided, regenerate handle
    if (updates.title && !updates.handle) {
      const existingProduct = await Product.findById(id);
      if (existingProduct && slugify(updates.title) !== existingProduct.handle) {
        updates.handle = await generateUniqueHandle(updates.title, existingProduct.handle);
      }
    }

    // If status is changing to active and publishedAt is not set
    if (updates.status === 'active') {
      const existingProduct = await Product.findById(id);
      if (existingProduct && !existingProduct.publishedAt) {
        (updates as any).publishedAt = new Date();
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.keyPattern?.handle) {
        res.status(400).json({
          success: false,
          message: 'A product with this handle already exists',
        });
        return;
      }
      if (error.keyPattern?.['variants.sku']) {
        res.status(400).json({
          success: false,
          message: 'A variant with this SKU already exists',
        });
        return;
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

// Delete product (soft delete by archiving)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product archived successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error archiving product',
    });
  }
};

// Hard delete product (permanent)
export const hardDeleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product permanently deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};

// Get all products (including all statuses) for admin
export const getAdminProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      productType,
      vendor,
      sort = '-createdAt',
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (productType) {
      filter.productType = productType;
    }

    if (vendor) {
      filter.vendor = vendor;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    // Add computed fields to response
    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
      };
    });

    res.json({
      success: true,
      data: {
        products: enrichedProducts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

// Get single product by ID for admin
export const getAdminProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    const doc = product.toJSON();
    const priceRange = getPriceRange(product.variants);
    const totalInventory = getTotalInventory(product.variants);

    res.json({
      success: true,
      data: {
        ...doc,
        priceRange,
        totalInventory,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// Update variant inventory
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { variantId, quantity, adjustment } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    const variant = product.variants.find(v => v._id?.toString() === variantId);
    if (!variant) {
      res.status(404).json({
        success: false,
        message: 'Variant not found',
      });
      return;
    }

    // If quantity is provided, set absolute value
    // If adjustment is provided, add/subtract from current
    if (typeof quantity === 'number') {
      variant.inventoryQuantity = Math.max(0, quantity);
    } else if (typeof adjustment === 'number') {
      variant.inventoryQuantity = Math.max(0, variant.inventoryQuantity + adjustment);
    }

    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating inventory',
    });
  }
};

// Bulk update product status
export const bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productIds, status } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Product IDs are required',
      });
      return;
    }

    if (!['draft', 'active', 'archived'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
      return;
    }

    const updateData: any = { status };
    if (status === 'active') {
      updateData.publishedAt = new Date();
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating products',
    });
  }
};

// Get distinct values for filters (product types, vendors, collections)
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [productTypes, vendors, collections, tags] = await Promise.all([
      Product.distinct('productType', { productType: { $ne: '' } }),
      Product.distinct('vendor', { vendor: { $ne: '' } }),
      Product.distinct('collections'),
      Product.distinct('tags'),
    ]);

    res.json({
      success: true,
      data: {
        productTypes,
        vendors,
        collections,
        tags,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching filter options',
    });
  }
};

// Get all orders for admin
export const getAdminOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email'),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updates: any = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order',
    });
  }
};

// Upload image to Cloudinary
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    // File is already uploaded to Cloudinary via multer middleware
    // req.file contains the Cloudinary response
    const fileWithPath = req.file as Express.Multer.File & { path: string };

    res.json({
      success: true,
      data: {
        url: fileWithPath.path,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image',
    });
  }
};

// Upload multiple images
export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
      return;
    }

    const files = req.files as (Express.Multer.File & { path: string })[];
    const urls = files.map((file) => file.path);

    res.json({
      success: true,
      data: {
        urls,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading images',
    });
  }
};

// Delete image from Cloudinary
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
      return;
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting image',
    });
  }
};
