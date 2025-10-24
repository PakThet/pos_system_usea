// 📄 /services/saleApi.ts
import { api } from '@/lib/api';
import {
  SalesFilter,
} from '@/types/sale';

export const salesApi = {
  async getSales(filters?: SalesFilter) {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.perPage) params.append('per_page', (filters.perPage || 10).toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      params.append('payment_method', filters.paymentMethod);
    }
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const response = await api.get(`/sales?${params}`);
    return response.data;
  },

  async getSalesStats(filters?: { period?: string; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();

    if (filters?.period) params.append('period', filters.period);
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const response = await api.get(`/sales/stats?${params}`);
    return response.data;
  },

  async getTopProducts(filters?: { period?: string }) {
    const params = new URLSearchParams();
    if (filters?.period) params.append('period', filters.period);

    const response = await api.get(`/sales/top-products?${params}`);
    return response.data;
  },

  async getSale(id: number) {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  async updateSaleStatus(id: number, status: string) {
    const response = await api.patch(`/sales/${id}/status`, { status });
    return response.data;
  },
};
