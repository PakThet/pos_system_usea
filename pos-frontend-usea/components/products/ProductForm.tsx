import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, CreateProductData } from '@/types/product';
import { categoryApi } from '@/services/categoryApi';
import { storeApi } from '@/services/storeApi';
import { Category, Store } from '@/types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: product?.name || '',
    description: product?.description || '',
    sku: product?.sku || '',
    slug: product?.slug || '',
    barcode: product?.barcode || '',
    price: product?.price || '',
    cost_price: product?.cost_price || '',
    tax_rate: product?.tax_rate || '',
    quantity: product?.quantity || 0,
    quantity_alert: product?.quantity_alert || 5,
    discount: product?.discount || 0,
    status: (product?.status as 'active' | 'inactive') || 'active',
    store_id: product?.store_id || 1,
    category_id: product?.category_id || 1,
    image: product?.image || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, storesResponse] = await Promise.all([
          categoryApi.getCategories(),
          storeApi.getStores(),
        ]);
        setCategories(categoriesResponse.data);
        setStores(storesResponse.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof CreateProductData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Enter SKU"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="Enter slug"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode *</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
            placeholder="Enter barcode"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost_price">Cost Price *</Label>
          <Input
            id="cost_price"
            type="number"
            step="0.01"
            value={formData.cost_price}
            onChange={(e) => handleChange('cost_price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_rate">Tax Rate (%) *</Label>
          <Input
            id="tax_rate"
            type="number"
            step="0.01"
            value={formData.tax_rate}
            onChange={(e) => handleChange('tax_rate', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity_alert">Quantity Alert *</Label>
          <Input
            id="quantity_alert"
            type="number"
            value={formData.quantity_alert}
            onChange={(e) => handleChange('quantity_alert', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount</Label>
          <Input
            id="discount"
            type="number"
            step="0.01"
            value={formData.discount}
            onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">Category *</Label>
          <Select 
            value={formData.category_id.toString()} 
            onValueChange={(value) => handleChange('category_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store_id">Store *</Label>
          <Select 
            value={formData.store_id.toString()} 
            onValueChange={(value) => handleChange('store_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter product description"
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};