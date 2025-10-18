import { ApiResponse, PaginatedResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Product, CreateProductData } from '@/types/product';

class ProductApiService extends BaseApiService {
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number;
    status?: string;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.fetchApi<Product[]>(endpoint) as Promise<PaginatedResponse<Product>>;
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.fetchApi<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return this.fetchApi<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.fetchApi<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export const productApi = new ProductApiService();