import { useState, useEffect } from 'react';
import { Order, OrderStats } from '@/types/order';
import { orderApi } from '@/services/orderApi';

interface UseOrdersProps {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export const useOrders = ({
  page = 1,
  perPage = 10,
  search = '',
  status,
  paymentStatus,
  startDate,
  endDate,
}: UseOrdersProps = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getOrders({
        page,
        per_page: perPage,
        search,
        status,
        payment_status: paymentStatus,
        start_date: startDate,
        end_date: endDate,
      });
      setOrders(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders();
  }, [page, perPage, search, status, paymentStatus, startDate, endDate]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    stats,
    loading,
    error,
    pagination,
    refetch,
  };
};