import { Response } from 'express';
import Cart from '../models/Cart';
import Product, { IProduct, IProductVariant } from '../models/Product';
import { AuthRequest } from '../types';

// Helper to find variant by size and color
const findVariantByOptions = (
  product: IProduct,
  size: string,
  color: string
): IProductVariant | undefined => {
  return product.variants.find((variant) => {
    const sizeOption = variant.options.find(
      (opt) => opt.name.toLowerCase() === 'size'
    );
    const colorOption = variant.options.find(
      (opt) => opt.name.toLowerCase() === 'color'
    );
    return (
      sizeOption?.value === size && colorOption?.value === color
    );
  });
};

// Helper to get total inventory across all variants
const getTotalInventory = (product: IProduct): number => {
  return product.variants.reduce(
    (sum, variant) => sum + variant.inventoryQuantity,
    0
  );
};

// Get user's cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'title variants images handle status',
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cart',
    });
  }
};

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { productId, quantity, size, color } = req.body;

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    if (product.status !== 'active') {
      res.status(400).json({
        success: false,
        message: 'Product is not available',
      });
      return;
    }

    // Find the matching variant by size and color
    const variant = findVariantByOptions(product, size, color);

    if (!variant) {
      // If no specific variant found, check total inventory
      const totalInventory = getTotalInventory(product);
      if (totalInventory < quantity) {
        res.status(400).json({
          success: false,
          message: 'Not enough stock available',
        });
        return;
      }
    } else {
      // Check variant-specific inventory
      if (variant.inventoryPolicy === 'deny' && variant.inventoryQuantity < quantity) {
        res.status(400).json({
          success: false,
          message: 'Not enough stock available for this variant',
        });
        return;
      }
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if item with same product, size, and color exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity, size, color });
    }

    await cart.save();

    // Populate and return
    cart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title variants images handle status',
    });

    res.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to cart',
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
      return;
    }

    // Verify stock
    const cartItem = cart.items[itemIndex];
    const product = await Product.findById(cartItem.productId);

    if (product) {
      // Find the matching variant
      const variant = findVariantByOptions(product, cartItem.size, cartItem.color);

      if (variant) {
        // Check variant-specific inventory
        if (variant.inventoryPolicy === 'deny' && variant.inventoryQuantity < quantity) {
          res.status(400).json({
            success: false,
            message: 'Not enough stock available',
          });
          return;
        }
      } else {
        // Check total inventory
        const totalInventory = getTotalInventory(product);
        if (totalInventory < quantity) {
          res.status(400).json({
            success: false,
            message: 'Not enough stock available',
          });
          return;
        }
      }
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Populate and return
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title variants images handle status',
    });

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating cart item',
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
      return;
    }

    cart.items = cart.items.filter(
      (item: any) => item._id.toString() !== itemId
    );

    await cart.save();

    // Populate and return
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title variants images handle status',
    });

    res.json({
      success: true,
      data: updatedCart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing from cart',
    });
  }
};

// Clear cart
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing cart',
    });
  }
};
