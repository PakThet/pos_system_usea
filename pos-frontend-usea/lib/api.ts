// import { Product, ApiResponse, PaginatedResponse } from '@/types/product';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// class ApiError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// // Generic function to handle fetch responses
// const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
//   const data = await response.json();
//   if (!response.ok) {
//     const message = data?.message || `HTTP error! status: ${response.status}`;
//     throw new ApiError(message);
//   }
//   return data;
// };

// class BaseApiService {
//   protected async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers: { 'Content-Type': 'application/json' },
//       ...options,
//     });
//     return handleResponse<T>(response);
//   }
// }

// class ProductApiService extends BaseApiService {
//   // Get all products with optional pagination/filters
//   async getProducts(params?: {
//     page?: number;
//     per_page?: number;
//     search?: string;
//     category_id?: number;
//     status?: string;
//   }): Promise<ApiResponse<PaginatedResponse<Product>>> {
//     const url = new URL('/products', API_BASE_URL);
//     if (params) {
//       Object.entries(params).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           url.searchParams.append(key, value.toString());
//         }
//       });
//     }
//     const response = await fetch(url.toString());
//     return handleResponse<PaginatedResponse<Product>>(response);
//   }

//   async getProduct(id: number): Promise<ApiResponse<Product>> {
//     return this.fetchApi<Product>(`/products/${id}`);
//   }

//   async createProduct(
//     product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'store' | 'category'>
//   ): Promise<ApiResponse<Product>> {
//     return this.fetchApi<Product>('/products', {
//       method: 'POST',
//       body: JSON.stringify(product),
//     });
//   }

//   async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
//     return this.fetchApi<Product>(`/products/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(product),
//     });
//   }

//   async deleteProduct(id: number): Promise<ApiResponse<null>> {
//     return this.fetchApi<null>(`/products/${id}`, { method: 'DELETE' });
//   }
// }

// class CategoryApiService extends BaseApiService {
//   async getCategories(): Promise<ApiResponse<Product[]>> {
//     return this.fetchApi<Product[]>('/categories');
//   }
// }

// class StoreApiService extends BaseApiService {
//   async getStores(): Promise<ApiResponse<Product[]>> {
//     return this.fetchApi<Product[]>('/stores');
//   }
// }

// // Export instances
// export const productService = new ProductApiService();
// export const categoryService = new CategoryApiService();
// export const storeService = new StoreApiService();
