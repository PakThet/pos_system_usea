import { api } from '@/lib/api';
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductsResponse,
  ProductFilters,
} from '@/types/product';

export const productApi = {
async getProducts(filters?: ProductFilters & { month?: number; year?: number }) {
  const params = new URLSearchParams();

  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.perPage) params.append('per_page', filters.perPage.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.category_id) params.append('category_id', filters.category_id.toString());
  if (filters?.store_id) params.append('store_id', filters.store_id.toString());
  if (filters?.month) params.append('month', filters.month.toString());
  if (filters?.year) params.append('year', filters.year.toString());

  const response = await api.get(`/products?${params}`);
  return response.data;
}
,

  async getProduct(id: string): Promise<{ data: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductData | FormData): Promise<{ data: Product }> {
    const isFormData = data instanceof FormData;

    const response = await api.post('/products', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });

    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductData | FormData): Promise<{ data: Product }> {
    const isFormData = data instanceof FormData;

    const response = await api.post(`/products/${id}?_method=PUT`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });

    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
