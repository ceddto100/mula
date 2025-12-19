import api from './axios.config';
import { ApiResponse, Product, PaginatedResponse } from '../types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sort?: string;
}

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<Product>['pagination'];
  }> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters.colors?.length) params.append('colors', filters.colors.join(','));
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get<ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>>(`/api/products?${params.toString()}`);
    return response.data.data!;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data.data!;
  },

  getProductsByCategory: async (category: string, page = 1, limit = 12): Promise<{
    products: Product[];
    pagination: PaginatedResponse<Product>['pagination'];
  }> => {
    const response = await api.get<ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>>(`/api/products/category/${category}?page=${page}&limit=${limit}`);
    return response.data.data!;
  },

  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/api/products/featured?limit=${limit}`);
    return response.data.data!;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/api/products/categories');
    return response.data.data!;
  },
};
