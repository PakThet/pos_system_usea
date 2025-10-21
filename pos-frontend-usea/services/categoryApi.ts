import { api } from '@/lib/api';
import { Category } from '@/types/category';

export const categoryApi = {
  async getCategories(): Promise<{ data: Category[] }> {
    const response = await api.get('/categories');
    return response.data.data;
  },
};