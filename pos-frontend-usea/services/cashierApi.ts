import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Cashier, CreateCashierData, CashierStats } from '@/types/cashier';

class CashierApiService extends BaseApiService {
  async getCashiers(): Promise<ApiResponse<Cashier[]>> {
    return this.fetchApi<Cashier[]>('/cashiers');
  }

  async getCashier(id: string): Promise<ApiResponse<Cashier>> {
    return this.fetchApi<Cashier>(`/cashiers/${id}`);
  }

  async createCashier(data: CreateCashierData): Promise<ApiResponse<Cashier>> {
    return this.fetchApi<Cashier>('/cashiers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCashier(id: string, data: Partial<CreateCashierData>): Promise<ApiResponse<Cashier>> {
    return this.fetchApi<Cashier>(`/cashiers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCashier(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/cashiers/${id}`, {
      method: 'DELETE',
    });
  }

  async updateCashierStatus(id: string, status: string): Promise<ApiResponse<Cashier>> {
    return this.fetchApi<Cashier>(`/cashiers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getCashierStats(): Promise<ApiResponse<CashierStats>> {
    return this.fetchApi<CashierStats>('/cashiers/stats/summary');
  }

  async recordCashierLogin(id: string): Promise<ApiResponse<Cashier>> {
    return this.fetchApi<Cashier>(`/cashiers/${id}/login`, {
      method: 'POST',
    });
  }

  
}

export const cashierApi = new CashierApiService();