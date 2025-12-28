import { Request, Response } from 'express';
import { Express } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import { AuthRequest } from '../types';
import { cloudinary } from '../config/cloudinary';

// Dashboard stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      lowStockProducts,
      orderStats,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find()
        .sort('-createdAt')
        .limit(5)
        .populate('userId', 'name email'),
      Product.find({ stock: { $lt: 10 }, isActive: true })
        .select('name stock')
        .limit(10),
      Order.aggregate([
        {
          $match: { paymentStatus: 'paid' },
        },
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

// Create product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, images, sizes, colors, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      category,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
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
    const updates = req.body;

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
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
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
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};

// Get all products (including inactive) for admin
export const getAdminProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (search) {
      filter.$text = { $search: search as string };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
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
