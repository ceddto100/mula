import api from './axios.config';
import { ApiResponse, Cart } from '../types';

export interface AddToCartData {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>('/api/cart');
    return response.data.data!;
  },

  addToCart: async (data: AddToCartData): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/api/cart', data);
    return response.data.data!;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>(`/api/cart/${itemId}`, { quantity });
    return response.data.data!;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>(`/api/cart/${itemId}`);
    return response.data.data!;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/api/cart');
  },
};
