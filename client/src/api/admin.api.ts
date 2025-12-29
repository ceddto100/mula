import api from './axios.config';
import {
  ApiResponse,
  Product,
  Order,
  PaginatedResponse,
  DashboardStats,
  CreateProductData,
  UpdateProductData,
  ProductFilterOptions,
} from '../types';

// Product list response
interface ProductListResponse {
  products: Product[];
  pagination: PaginatedResponse<Product>['pagination'];
}

// Admin API functions
export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
    return response.data.data!;
  },

  // Products - Get list with filters
  getProducts: async (
    page = 1,
    limit = 20,
    options?: {
      search?: string;
      status?: string;
      productType?: string;
      vendor?: string;
      sort?: string;
    }
  ): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (options?.search) params.append('search', options.search);
    if (options?.status) params.append('status', options.status);
    if (options?.productType) params.append('productType', options.productType);
    if (options?.vendor) params.append('vendor', options.vendor);
    if (options?.sort) params.append('sort', options.sort);

    const response = await api.get<ApiResponse<ProductListResponse>>(
      `/api/admin/products?${params.toString()}`
    );
    return response.data.data!;
  },

  // Products - Get single by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/api/admin/products/${id}`);
    return response.data.data!;
  },

  // Products - Create
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/api/admin/products', data);
    return response.data.data!;
  },

  // Products - Update
  updateProduct: async (id: string, data: UpdateProductData): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/api/admin/products/${id}`, data);
    return response.data.data!;
  },

  // Products - Delete (archive)
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/products/${id}`);
  },

  // Products - Permanent delete
  permanentDeleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/products/${id}/permanent`);
  },

  // Products - Update inventory
  updateInventory: async (
    productId: string,
    data: { variantId: string; quantity?: number; adjustment?: number }
  ): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(
      `/api/admin/products/${productId}/inventory`,
      data
    );
    return response.data.data!;
  },

  // Products - Bulk update status
  bulkUpdateStatus: async (
    productIds: string[],
    status: 'draft' | 'active' | 'archived'
  ): Promise<{ modifiedCount: number }> => {
    const response = await api.post<ApiResponse<{ modifiedCount: number }>>(
      '/api/admin/products/bulk/status',
      { productIds, status }
    );
    return response.data.data!;
  },

  // Products - Get filter options
  getFilterOptions: async (): Promise<ProductFilterOptions> => {
    const response = await api.get<ApiResponse<ProductFilterOptions>>(
      '/api/admin/products/filters'
    );
    return response.data.data!;
  },

  // Orders - Get list
  getOrders: async (
    page = 1,
    limit = 20,
    status?: string,
    paymentStatus?: string
  ): Promise<{
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

  // Orders - Update status
  updateOrderStatus: async (
    id: string,
    data: { orderStatus?: string; paymentStatus?: string }
  ): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/api/admin/orders/${id}`, data);
    return response.data.data!;
  },

  // Image upload - Single
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

  // Image upload - Multiple
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<ApiResponse<{ urls: string[] }>>(
      '/api/admin/upload-multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!.urls;
  },

  // Image delete
  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete('/api/admin/image', { data: { publicId } });
  },
};

export type { CreateProductData, UpdateProductData };
