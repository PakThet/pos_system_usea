// services/customerApi.ts
import { Customer, CreateCustomerData, CustomerStats, ApiResponse } from '@/types/customer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class CustomerApiService {
  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    return this.fetchApi('/customers');
  }

  async getCustomerStats(): Promise<ApiResponse<CustomerStats>> {
    return this.fetchApi('/customers/stats');
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return this.fetchApi(`/customers/${id}`);
  }

  async createCustomer(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    return this.fetchApi('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<ApiResponse<Customer>> {
    return this.fetchApi(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const customerApi = new CustomerApiService();