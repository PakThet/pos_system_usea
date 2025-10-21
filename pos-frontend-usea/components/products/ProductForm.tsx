import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, CreateProductData, Store } from "@/types/product";
import { Category } from "@/types/category";

interface ProductFormProps {
  product?: Product;
  categories?: Category[];
  stores?: Store[];
  onSubmit: (data: FormData) => void; // updated to support file upload
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({
  product,
  categories = [],
  stores = [],
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    slug: product?.slug || "",
    barcode: product?.barcode || "",
    price: product?.price || "",
    cost_price: product?.cost_price || "",
    tax_rate: product?.tax_rate || "",
    quantity: product?.quantity || 0,
    quantity_alert: product?.quantity_alert || 5,
    discount: product?.discount || 0,
    status: (product?.status as "active" | "inactive") || "active",
    store_id: Number(product?.store_id || stores[0]?.id || 1),
    category_id: Number(product?.category_id || categories[0]?.id || 1),
    image: product?.image || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || "");

  const handleChange = (field: keyof CreateProductData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    // Skip the image field in formData
    if (key !== "image" && value !== undefined && value !== null) {
      data.append(key, value.toString());
    }
  });

  // Append file separately
  if (imageFile) data.append("image", imageFile);

  onSubmit(data);
};


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* SKU */}
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="Enter SKU"
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="Enter product slug"
            required
          />
        </div>

        {/* Barcode */}
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode *</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => handleChange("barcode", e.target.value)}
            placeholder="Enter barcode"
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        {/* Cost Price */}
        <div className="space-y-2">
          <Label htmlFor="cost_price">Cost Price *</Label>
          <Input
            type="number"
            id="cost_price"
            value={formData.cost_price}
            onChange={(e) => handleChange("cost_price", e.target.value)}
            placeholder="Enter cost price"
            required
          />
        </div>

        {/* Tax Rate */}
        <div className="space-y-2">
          <Label htmlFor="tax_rate">Tax Rate (%)</Label>
          <Input
            type="number"
            id="tax_rate"
            value={formData.tax_rate}
            onChange={(e) => handleChange("tax_rate", e.target.value)}
            placeholder="Enter tax rate"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Quantity Alert */}
        <div className="space-y-2">
          <Label htmlFor="quantity_alert">Quantity Alert</Label>
          <Input
            type="number"
            id="quantity_alert"
            value={formData.quantity_alert}
            onChange={(e) =>
              handleChange("quantity_alert", parseInt(e.target.value))
            }
            placeholder="Enter alert quantity"
          />
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            type="number"
            id="discount"
            value={formData.discount}
            onChange={(e) => handleChange("discount", parseFloat(e.target.value))}
            placeholder="Enter discount percentage"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
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

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category_id">Category *</Label>
          <Select
            value={formData.category_id.toString()}
            onValueChange={(value) =>
              handleChange("category_id", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Store */}
        <div className="space-y-2">
          <Label htmlFor="store_id">Store *</Label>
          <Select
            value={formData.store_id.toString()}
            onValueChange={(value) =>
              handleChange("store_id", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(stores) &&
                stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter product description"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
