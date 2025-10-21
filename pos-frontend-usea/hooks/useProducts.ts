'use client';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ cate: 'all', inStock: 'all' });
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
      setFilteredProducts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filters.cate === 'all' || p.cate === filters.cate;

      const matchesStock =
        filters.inStock === 'all' ||
        (filters.inStock === 'in' && p.quantity > 0) ||
        (filters.inStock === 'out' && p.quantity === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, filters, products]);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loading,
    setProducts,
  };
}
