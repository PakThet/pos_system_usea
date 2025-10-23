import { useState, useEffect } from 'react';
import { Order, OrderFilters, OrdersResponse } from '@/types/order';
import { orderApi } from '@/services/orderApi';

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
  };
  refetch: () => void;
}

export function useOrders(filters?: OrderFilters): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: OrdersResponse = await orderApi.getOrders(filters);
      setOrders(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filters?.page, filters?.perPage, filters?.search, filters?.status, filters?.payment_status]);

  return {
    orders,
    loading,
    error,
    pagination,
    refetch: loadOrders,
  };
}