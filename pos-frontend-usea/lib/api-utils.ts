import { Product, Category, Store, CreateProductData, UpdateProductData, ApiProduct, ApiCategory, ApiStore } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Transform API data to app format
export const transformApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id.toString(),
  image: apiProduct.image,
  store_id: apiProduct.store_id.toString(),
  category_id: apiProduct.category_id.toString(),
  p_name: apiProduct.p_name,
  description: apiProduct.description,
  sku: apiProduct.sku,
  slug: apiProduct.slug,
  barcode: apiProduct.barcode,
  price: apiProduct.price,
  tax: apiProduct.tax,
  quantity: apiProduct.quantity,
  discount: apiProduct.discount,
  quantity_alert: apiProduct.quantity_alert,
  createdAt: new Date(apiProduct.created_at).toDateString(),
  updatedAt: new Date(apiProduct.updated_at).toDateString(),
  store: apiProduct.store,
  category: apiProduct.category
});

export const transformApiCategory = (apiCategory: ApiCategory): Category => ({
  id: apiCategory.id.toString(),
  name: apiCategory.name,
  slug: apiCategory.slug,
  desc: apiCategory.desc,
  status: apiCategory.status,
  createdAt: new Date(apiCategory.created_at).toDateString(),
  updatedAt: new Date(apiCategory.updated_at).toDateString()
});

export const transformApiStore = (apiStore: ApiStore): Store => ({
  id: apiStore.id.toString(),
  name: apiStore.name,
  location: apiStore.location,
  createdAt: new Date(apiStore.created_at).toDateString(),
  updatedAt: new Date(apiStore.updated_at).toDateString()
});

// Transform app data to API format
export const transformToApiProductFormat = (data: CreateProductData | UpdateProductData) => ({
  p_name: data.p_name,
  description: data.description,
  sku: data.sku,
  slug: data.slug,
  barcode: data.barcode,
  price: data.price,
  tax: data.tax,
  quantity: data.quantity,
  discount: data.discount,
  quantity_alert: data.quantity_alert,
  store_id: parseInt(data.store_id),
  category_id: parseInt(data.category_id),
  image: data.image || null
});

// API functions
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.data) ? data.data.map(transformApiProduct) : [];
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.data) ? data.data.map(transformApiCategory) : [];
};

export const fetchStores = async (): Promise<Store[]> => {
  const response = await fetch(`${API_BASE_URL}/stores`);
  if (!response.ok) throw new Error(`Failed to fetch stores: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.data) ? data.data.map(transformApiStore) : [];
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(`Failed to create product: ${response.status}`);
  const result = await response.json();
  return transformApiProduct(result.data);
};

export const updateProduct = async (id: string, formData: FormData): Promise<Product> => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(`Failed to update product: ${response.status}`);
  const result = await response.json();
  return transformApiProduct(result.data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete product: ${response.status}`);
  await response.json();
};