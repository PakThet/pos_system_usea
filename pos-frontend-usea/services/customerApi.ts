import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Customer, CreateCustomerData, CustomerStats } from '@/types/customer';

class CustomerApiService extends BaseApiService {
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    return this.fetchApi<Customer[]>('/customers');
  }

  async getCustomerStats(): Promise<ApiResponse<CustomerStats>> {
    return this.fetchApi<CustomerStats>('/customers/stats');
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return this.fetchApi<Customer>(`/customers/${id}`);
  }

  async createCustomer(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    return this.fetchApi<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<ApiResponse<Customer>> {
    return this.fetchApi<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  async searchCustomers(query: string): Promise<ApiResponse<Customer[]>> {
    return this.fetchApi<Customer[]>(`/customers/search/${query}`);
  }

  async getCustomerOrders(customerId: string): Promise<ApiResponse<any>> {
    return this.fetchApi(`/customers/${customerId}/orders`);
  }
}

export const customerApi = new CustomerApiService();