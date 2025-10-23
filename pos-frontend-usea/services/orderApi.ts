import { api } from '@/lib/api';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  OrdersResponse,
  OrderFilters,
  OrderStats,
} from '@/types/order';

export const orderApi = {
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.perPage) params.append('per_page', filters.perPage.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.payment_status && filters.payment_status !== 'all') {
      params.append('payment_status', filters.payment_status);
    }
    if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
    if (filters?.store_id) params.append('store_id', filters.store_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await api.get(`/orders?${params}`);
    return response.data;
  },

  async getOrder(id: string): Promise<{ data: Order }> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<{ data: Order }> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  async updatePaymentStatus(id: string, payment_status: PaymentStatus): Promise<{ data: Order }> {
    const response = await api.patch(`/orders/${id}/payment-status`, { payment_status });
    return response.data;
  },

  async getOrderStats(): Promise<{ data: OrderStats }> {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },
};