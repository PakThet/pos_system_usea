import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productApi } from '@/services/productApi';

interface UseProductsProps {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: number;
  status?: string;
}

export const useProducts = ({
  page = 1,
  perPage = 10,
  search = '',
  categoryId,
  status,
}: UseProductsProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getProducts({
        page,
        per_page: perPage,
        search,
        category_id: categoryId,
        status,
      });
      setProducts(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, perPage, search, categoryId, status]);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
};