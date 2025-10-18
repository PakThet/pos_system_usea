import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Product, CreateProductData, Category, Store } from '@/types/product';

class ProductApiService extends BaseApiService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.fetchApi<Product[]>('/products');
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

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
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

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.fetchApi<Product[]>(`/products/search/${query}`);
  }

  async getProductsByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    return this.fetchApi<Product[]>(`/products/category/${categoryId}`);
  }
}

export const productApi = new ProductApiService();