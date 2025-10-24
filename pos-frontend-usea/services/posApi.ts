// services/posApi.ts
import { api } from '@/lib/api';
import { Product, Customer, SaleRequest } from '@/types/pos';

export const posApi = {
  async getProducts(): Promise<{ data: Product[] }> {
    const response = await api.get('/products');
    return response.data;
  },

  async getCustomers(): Promise<{ data: { data: Customer[] } }> {
    const response = await api.get('/customers');
    return response.data;
  },

  async createSale(saleData: SaleRequest): Promise<any> {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  async searchProducts(query: string): Promise<{ data: Product[] }> {
    const response = await api.get(`/products?search=${encodeURIComponent(query)}`);
    return response.data;
  }
};