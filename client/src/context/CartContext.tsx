import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, Product } from '../types';
import { cartApi, AddToCartData } from '../api/cart.api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { getProductPrice } from '../utils/productView';
import { trackEvent } from '../utils/analytics';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (data: AddToCartData & { product?: Product }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_STORAGE_KEY = 'guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      setCart(stored ? JSON.parse(stored) : null);
      return;
    }
    try {
      setIsLoading(true);
      const cartData = await cartApi.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (data: AddToCartData & { product?: Product }) => {
    if (!isAuthenticated) {
      if (!data.product) {
        toast.error('Unable to add item to guest cart');
        return;
      }
      const currentCart = cart || {
        _id: 'guest',
        userId: 'guest',
        items: [],
        updatedAt: new Date().toISOString(),
      };
      const existingItemIndex = currentCart.items.findIndex(
        (item) =>
          item.productId._id === data.productId &&
          item.size === data.size &&
          item.color === data.color
      );
      const updatedItems = [...currentCart.items];
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + data.quantity,
        };
      } else {
        updatedItems.push({
          _id: `${data.productId}-${data.size}-${data.color}`,
          productId: data.product,
          quantity: data.quantity,
          size: data.size,
          color: data.color,
        });
      }
      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
      setCart(updatedCart);
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(updatedCart));
      trackEvent('add_to_cart', { product_id: data.productId, quantity: data.quantity });
      toast.success('Added to cart!');
      return;
    }
    try {
      setIsLoading(true);
      const updatedCart = await cartApi.addToCart(data);
      setCart(updatedCart);
      trackEvent('add_to_cart', { product_id: data.productId, quantity: data.quantity });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) {
      const currentCart = cart;
      if (!currentCart) return;
      const updatedCart = {
        ...currentCart,
        items: currentCart.items
          .map((item) => (item._id === itemId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
        updatedAt: new Date().toISOString(),
      };
      const nextCart = updatedCart.items.length ? updatedCart : null;
      setCart(nextCart);
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(nextCart));
      return;
    }
    try {
      setIsLoading(true);
      const updatedCart = await cartApi.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isAuthenticated) {
      const currentCart = cart;
      if (!currentCart) return;
      const updatedCart = {
        ...currentCart,
        items: currentCart.items.filter((item) => item._id !== itemId),
        updatedAt: new Date().toISOString(),
      };
      const nextCart = updatedCart.items.length ? updatedCart : null;
      setCart(nextCart);
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(nextCart));
      trackEvent('remove_from_cart', { item_id: itemId });
      toast.success('Item removed from cart');
      return;
    }
    try {
      setIsLoading(true);
      const updatedCart = await cartApi.removeFromCart(itemId);
      setCart(updatedCart);
      trackEvent('remove_from_cart', { item_id: itemId });
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      return;
    }
    try {
      setIsLoading(true);
      await cartApi.clearCart();
      setCart(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const subtotal = cart?.items.reduce((sum, item) => {
    const price = item.productId ? getProductPrice(item.productId) : 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
