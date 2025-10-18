import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Store } from '@/types/product';

class StoreApiService extends BaseApiService {
  async getStores(): Promise<ApiResponse<Store[]>> {
    return this.fetchApi<Store[]>('/stores');
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    return this.fetchApi<Store>(`/stores/${id}`);
  }

  async createStore(data: Omit<Store, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Store>> {
    return this.fetchApi<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStore(id: string, data: Partial<Store>): Promise<ApiResponse<Store>> {
    return this.fetchApi<Store>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStore(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/stores/${id}`, {
      method: 'DELETE',
    });
  }
}

export const storeApi = new StoreApiService();