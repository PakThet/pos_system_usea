import { api } from '@/lib/api';
import { Store } from '@/types/product';

export const storeApi = {
  async getStores(): Promise<{ data: Store[] }> {
    const response = await api.get('/stores');
    return response.data.data;
  },

};