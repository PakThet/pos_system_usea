import { api } from '@/lib/api';
import {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomersResponse,
  CustomerFilters,
  CustomerStats,
} from '@/types/customer';

export const customerApi = {
  async getCustomers(filters?: CustomerFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.perPage) params.append('per_page', filters.perPage.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.tier && filters.tier !== 'all') params.append('tier', filters.tier);

    const response = await api.get<{
      success: boolean;
      message: string;
      data: {
        current_page: number;
        data: Customer[];
      };
    }>('/customers');
    
    return { data: response.data.data.data };

  },

  async getCustomer(id: string): Promise<{ data: Customer }> {
    const response = await api.get<{ data: Customer }>(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(data: CreateCustomerData): Promise<{ data: Customer }> {
    const response = await api.post<{ data: Customer }>('/customers', data);
    return response.data;
  },

  async updateCustomer(id: string, data: UpdateCustomerData): Promise<{ data: Customer }> {
    const response = await api.put<{ data: Customer }>(`/customers/${id}`, data);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async getCustomerStats(): Promise<{ data: CustomerStats }> {
    const response = await api.get<{ data: CustomerStats }>('/customers/stats');
    return response.data;
  },

  async exportCustomers(): Promise<{ data: { url: string } }> {
    const response = await api.get<{ data: { url: string } }>('/customers/export');
    return response.data;
  },
};