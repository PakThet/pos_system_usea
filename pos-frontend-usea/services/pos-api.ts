// api/pos-api.ts
import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import { Sale } from '@/types/sale';

class POSApiService extends BaseApiService {
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.fetchApi<Product[]>(`/products?search=${query}`);
  }

  async getProductByBarcode(barcode: string): Promise<ApiResponse<Product>> {
    return this.fetchApi<Product>(`/products?barcode=${barcode}`);
  }

  async searchCustomers(query: string): Promise<ApiResponse<Customer[]>> {
    return this.fetchApi<Customer[]>(`/customers?search=${query}`);
  }

  async createQuickCustomer(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.fetchApi<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createSale(data: any): Promise<ApiResponse<Sale>> {
    return this.fetchApi<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const posApi = new POSApiService();