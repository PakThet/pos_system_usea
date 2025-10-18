import { ApiResponse } from '@/types/api';
import BaseApiService from './baseApi';
import { Order, CreateOrderData, OrderStats } from '@/types/order';

class OrderApiService extends BaseApiService {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.fetchApi<Order[]>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: string, data: Partial<CreateOrderData>): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return this.fetchApi<void>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<ApiResponse<Order>> {
    return this.fetchApi<Order>(`/orders/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  }

  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return this.fetchApi<OrderStats>('/orders/stats/summary');
  }
}

export const orderApi = new OrderApiService();