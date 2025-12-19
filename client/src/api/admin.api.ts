import api from './axios.config';
import { ApiResponse, Product, Order, PaginatedResponse, DashboardStats } from '../types';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  category: string;
}

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
    return response.data.data!;
  },

  // Products
  getProducts: async (page = 1, limit = 20, search?: string): Promise<{
    products: Product[];
    pagination: PaginatedResponse<Product>['pagination'];
  }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);

    const response = await api.get<ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>>(`/api/admin/products?${params.toString()}`);
    return response.data.data!;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/api/admin/products', data);
    return response.data.data!;
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/api/admin/products/${id}`, data);
    return response.data.data!;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/products/${id}`);
  },

  // Orders
  getOrders: async (page = 1, limit = 20, status?: string, paymentStatus?: string): Promise<{
    orders: Order[];
    pagination: PaginatedResponse<Order>['pagination'];
  }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status) params.append('status', status);
    if (paymentStatus) params.append('paymentStatus', paymentStatus);

    const response = await api.get<ApiResponse<{
      orders: Order[];
      pagination: PaginatedResponse<Order>['pagination'];
    }>>(`/api/admin/orders?${params.toString()}`);
    return response.data.data!;
  },

  updateOrderStatus: async (id: string, data: {
    orderStatus?: string;
    paymentStatus?: string;
  }): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/api/admin/orders/${id}`, data);
    return response.data.data!;
  },

  // Image upload
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ url: string }>>('/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!.url;
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<ApiResponse<{ urls: string[] }>>('/api/admin/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!.urls;
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete('/api/admin/image', { data: { publicId } });
  },
};
