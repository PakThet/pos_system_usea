import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Cashier, CreateCashierData, CashierStats } from '@/types/cashier';

class CashierApiService extends BaseApiService {
  async getCashiers(): Promise<ApiResponse<Cashier[]>> {
    const response = await this.fetchApi<Cashier[]>('/cashiers');

    // ✅ Normalize permissions and numeric values
    if (response.success && Array.isArray(response.data)) {
      response.data = response.data.map((cashier: any) => ({
        ...cashier,
        permissions:
          typeof cashier.permissions === 'string'
            ? JSON.parse(cashier.permissions)
            : cashier.permissions,
        hourly_rate: Number(cashier.hourly_rate),
        total_sales: Number(cashier.total_sales),
        // Optional: add full name for convenience
        name: `${cashier.first_name} ${cashier.last_name}`,
      }));
    }

    return response;
  }

  async getCashier(id: string): Promise<ApiResponse<Cashier>> {
    const response = await this.fetchApi<Cashier>(`/cashiers/${id}`);

    // ✅ Normalize single cashier
    if (response.success && response.data) {
      const c = response.data as any;
      response.data = {
        ...c,
        permissions:
          typeof c.permissions === 'string' ? JSON.parse(c.permissions) : c.permissions,
        hourly_rate: Number(c.hourly_rate),
        total_sales: Number(c.total_sales),
        name: `${c.first_name} ${c.last_name}`,
      };
    }

    return response;
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
