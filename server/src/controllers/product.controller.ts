import { Request, Response } from 'express';
import Product from '../models/Product';
import { ProductFilter } from '../types';
import { getPriceRange, getTotalInventory, isInStock } from '../utils/product.utils';

// Get all active products with filtering and pagination
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      productType,
      vendor,
      minPrice,
      maxPrice,
      tags,
      colorFamily,
      size,
      gender,
      fit,
      collection,
      search,
      sort = '-publishedAt',
    } = req.query;

    // Build filter - only active products for public
    const filter: any = { status: 'active' };

    if (productType) {
      filter.productType = productType;
    }

    if (vendor) {
      filter.vendor = vendor;
    }

    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      if (minPrice) filter['variants.price'].$gte = Number(minPrice);
      if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : (tags as string).split(',');
      filter.tags = { $in: tagArray.map(t => t.toLowerCase().trim()) };
    }

    if (colorFamily) {
      const colorArray = Array.isArray(colorFamily) ? colorFamily : (colorFamily as string).split(',');
      filter.colorFamily = { $in: colorArray };
    }

    if (size) {
      const sizeArray = Array.isArray(size) ? size : (size as string).split(',');
      filter['options'] = {
        $elemMatch: {
          name: { $regex: /size/i },
          values: { $in: sizeArray },
        },
      };
    }

    if (gender) {
      filter.gender = gender;
    }

    if (fit) {
      filter.fit = fit;
    }

    if (collection) {
      filter.collections = collection;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    // Enrich products with computed fields
    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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

// Get single product by handle (SEO-friendly URL)
export const getProductByHandle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle } = req.params;

    const product = await Product.findOne({ handle, status: 'active' });

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
    const inStock = isInStock(product.variants);

    // Build SEO metadata
    const seo = {
      title: product.seoTitle || product.title,
      description: product.seoDescription || '',
      canonicalUrl: `/products/${product.handle}`,
      keywords: product.metaKeywords.length > 0 ? product.metaKeywords : product.tags,
      image: product.images[0]?.url || null,
      imageAlt: product.images[0]?.alt || product.title,
    };

    res.json({
      success: true,
      data: {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
        seo,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// Get single product by ID
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, status: 'active' });

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
    const inStock = isInStock(product.variants);

    res.json({
      success: true,
      data: {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// Get products by product type (category)
export const getProductsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 12, sort = '-publishedAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      productType: { $regex: new RegExp(type, 'i') },
      status: 'active',
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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

// Get products by collection
export const getProductsByCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 12, sort = '-publishedAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      collections: collection,
      status: 'active',
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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

// Get products by vendor
export const getProductsByVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vendor } = req.params;
    const { page = 1, limit = 12, sort = '-publishedAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      vendor: { $regex: new RegExp(vendor, 'i') },
      status: 'active',
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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

// Get all product types (categories)
export const getProductTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const productTypes = await Product.distinct('productType', {
      status: 'active',
      productType: { $ne: '' },
    });

    res.json({
      success: true,
      data: productTypes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product types',
    });
  }
};

// Get all collections
export const getCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const collections = await Product.distinct('collections', {
      status: 'active',
    });

    res.json({
      success: true,
      data: collections.filter(c => c), // Remove empty strings
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collections',
    });
  }
};

// Get all vendors (brands)
export const getVendors = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await Product.distinct('vendor', {
      status: 'active',
      vendor: { $ne: '' },
    });

    res.json({
      success: true,
      data: vendors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendors',
    });
  }
};

// Get featured products (for landing page)
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 8;

    // Get newest active products as featured
    const products = await Product.find({ status: 'active' })
      .sort('-publishedAt')
      .limit(limit);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
      };
    });

    res.json({
      success: true,
      data: enrichedProducts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured products',
    });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      $text: { $search: q },
      status: 'active',
    };

    const [products, total] = await Promise.all([
      Product.find(filter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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
        query: q,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching products',
    });
  }
};

// Get filter options for active products
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [productTypes, vendors, collections, tags, genders, fits, colorFamilies] = await Promise.all([
      Product.distinct('productType', { status: 'active', productType: { $ne: '' } }),
      Product.distinct('vendor', { status: 'active', vendor: { $ne: '' } }),
      Product.distinct('collections', { status: 'active' }),
      Product.distinct('tags', { status: 'active' }),
      Product.distinct('gender', { status: 'active', gender: { $ne: null } }),
      Product.distinct('fit', { status: 'active', fit: { $ne: null } }),
      Product.distinct('colorFamily', { status: 'active' }),
    ]);

    // Get price range
    const priceStats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$variants' },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$variants.price' },
          maxPrice: { $max: '$variants.price' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        productTypes,
        vendors,
        collections: collections.filter(c => c),
        tags,
        genders,
        fits,
        colorFamilies: colorFamilies.filter(c => c),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0 },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching filter options',
    });
  }
};

// Legacy compatibility: Get products by category (maps to productType)
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort = '-publishedAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      productType: { $regex: new RegExp(category, 'i') },
      status: 'active',
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const enrichedProducts = products.map(product => {
      const doc = product.toJSON();
      const priceRange = getPriceRange(product.variants);
      const totalInventory = getTotalInventory(product.variants);
      const inStock = isInStock(product.variants);
      return {
        ...doc,
        priceRange,
        totalInventory,
        inStock,
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

// Legacy compatibility: Get categories (maps to productTypes)
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('productType', {
      status: 'active',
      productType: { $ne: '' },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories',
    });
  }
};
