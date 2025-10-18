import { ApiResponse, PaginatedResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Order, OrderStats } from '@/types/order';

class OrderApiService extends BaseApiService {
  async getOrders(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    payment_status?: string;
    customer_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.fetchApi<Order[]>(endpoint) as Promise<PaginatedResponse<Order>>;
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}`);
  }


  async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(id: string, payment_status: Order['payment_status']): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status }),
    });
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }
}

export const orderApi = new OrderApiService();