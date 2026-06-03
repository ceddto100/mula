import api from './axios.config';
import { ApiResponse, Product, PaginatedResponse, HomePageImages, HomePageContent, CategoryHeroConfig } from '../types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sort?: string;
}

// In-flight + short-lived response cache for read-only endpoints.
// Prevents duplicate concurrent fetches (e.g. App + Home both load
// home-page content) and avoids re-hitting the network when the user
// navigates back to a cached route during a session.
const CACHE_TTL_MS = 60_000;
type CacheEntry<T> = { value?: T; promise?: Promise<T>; expires: number };
const cache = new Map<string, CacheEntry<unknown>>();

const cached = <T>(key: string, fetcher: () => Promise<T>, ttl = CACHE_TTL_MS): Promise<T> => {
  const now = Date.now();
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expires > now) {
    if (entry.value !== undefined) return Promise.resolve(entry.value);
    if (entry.promise) return entry.promise;
  }
  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, expires: Date.now() + ttl });
      return value;
    })
    .catch((err) => {
      cache.delete(key);
      throw err;
    });
  cache.set(key, { promise, expires: now + ttl });
  return promise;
};

export const invalidateProductsCache = (): void => {
  cache.clear();
};

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<{
    products: Product[];
    pagination: PaginatedResponse<Product>['pagination'];
  }> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.category) params.append('category', filters.category);
    if (filters.productType) params.append('productType', filters.productType);
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters.colors?.length) params.append('colors', filters.colors.join(','));
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get<ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>>(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data.data!;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data.data!;
  },

  getProductByHandle: async (handle: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/api/products/handle/${handle}`);
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

  getFeaturedProducts: (limit = 8): Promise<Product[]> =>
    cached(`featured:${limit}`, async () => {
      const response = await api.get<ApiResponse<Product[]>>(`/api/products/featured?limit=${limit}`);
      return response.data.data!;
    }),

  getCategories: (): Promise<string[]> =>
    cached('categories', async () => {
      const response = await api.get<ApiResponse<string[]>>('/api/products/categories');
      return response.data.data!;
    }),

  getProductTypes: (category?: string): Promise<string[]> => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    const query = params.toString();

    return cached(`product-types:${category || 'all'}`, async () => {
      const response = await api.get<ApiResponse<string[]>>(`/api/products/types${query ? `?${query}` : ''}`);
      return response.data.data!;
    });
  },

  getHomePageImages: (): Promise<HomePageImages> =>
    cached('homepage-images', async () => {
      const response = await api.get<ApiResponse<HomePageImages>>('/api/products/homepage-images');
      return response.data.data!;
    }),

  getHomePageContent: (): Promise<HomePageContent> =>
    cached('homepage-content', async () => {
      const response = await api.get<ApiResponse<HomePageContent>>('/api/products/homepage-content');
      return response.data.data!;
    }),

  getCategoryHeroes: (): Promise<CategoryHeroConfig> =>
    cached('category-heroes', async () => {
      const response = await api.get<ApiResponse<CategoryHeroConfig>>('/api/products/category-heroes');
      return response.data.data!;
    }),
};
