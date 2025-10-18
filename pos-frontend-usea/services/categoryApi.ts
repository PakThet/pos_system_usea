import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Category } from '@/types/product';
import { CreateCategoryData } from '@/types/category';

class CategoryApiService extends BaseApiService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.fetchApi<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.fetchApi<Category>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryData & { status?: 'active' | 'inactive' }): Promise<ApiResponse<Category>> {
  return this.fetchApi<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const categoryApi = new CategoryApiService();