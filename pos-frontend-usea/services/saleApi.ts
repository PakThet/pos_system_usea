import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { CreateSaleData, Sale } from '@/types/sale';

class SaleApiService extends BaseApiService {
  async getSales(): Promise<ApiResponse<Sale[]>> {
    return this.fetchApi<Sale[]>('/sales');
  }

  async getSale(id: string): Promise<ApiResponse<Sale>> {
    return this.fetchApi<Sale>(`/sales/${id}`);
  }

  async createSale(data: CreateSaleData): Promise<ApiResponse<Sale>> {
    return this.fetchApi<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSale(id: string, data: Partial<CreateSaleData>): Promise<ApiResponse<Sale>> {
    return this.fetchApi<Sale>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSale(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  async getRecentSales(): Promise<ApiResponse<Sale[]>> {
    return this.fetchApi<Sale[]>('/sales/recent');
  }

  async refundSale(id: string): Promise<ApiResponse<Sale>> {
    return this.fetchApi<Sale>(`/sales/${id}/refund`, {
      method: 'POST',
    });
  }
}

export const saleApi = new SaleApiService();