import api from './axios.config';
import { ApiResponse, Order, PaginatedResponse, ShippingAddress } from '../types';

export const ordersApi = {
  getOrders: async (page = 1, limit = 10): Promise<{
    orders: Order[];
    pagination: PaginatedResponse<Order>['pagination'];
  }> => {
    const response = await api.get<ApiResponse<{
      orders: Order[];
      pagination: PaginatedResponse<Order>['pagination'];
    }>>(`/api/orders?page=${page}&limit=${limit}`);
    return response.data.data!;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return response.data.data!;
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/number/${orderNumber}`);
    return response.data.data!;
  },

  getOrderBySession: async (sessionId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/session/${sessionId}`);
    return response.data.data!;
  },

  createCheckoutSession: async (shippingAddress: ShippingAddress): Promise<{
    sessionId: string;
    url: string;
  }> => {
    const response = await api.post<ApiResponse<{
      sessionId: string;
      url: string;
    }>>('/api/payment/create-checkout-session', { shippingAddress });
    return response.data.data!;
  },

  verifyPayment: async (sessionId: string): Promise<{
    paymentStatus: string;
    order: Order;
  }> => {
    const response = await api.get<ApiResponse<{
      paymentStatus: string;
      order: Order;
    }>>(`/api/payment/verify/${sessionId}`);
    return response.data.data!;
  },
};
