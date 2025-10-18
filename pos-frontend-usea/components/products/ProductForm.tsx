import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Store, Product, CreateProductData } from "@/types/product";
import { ImageUpload } from "./ImageUpload";

interface ProductFormProps {
  product?: Product | null;
  formData: CreateProductData;
  categories: Category[];
  stores: Store[];
  imagePreview: string | null;
  uploadingImage: boolean;
  onFormDataChange: (data: CreateProductData) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onTriggerFileInput: () => void;
}

export const ProductForm = ({
  product,
  formData,
  categories,
  stores,
  imagePreview,
  uploadingImage,
  onFormDataChange,
  onImageUpload,
  onRemoveImage,
  onTriggerFileInput,
}: ProductFormProps) => {
  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="grid gap-4 py-4">
      <ImageUpload
        imagePreview={imagePreview}
        uploadingImage={uploadingImage}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        onTriggerFileInput={onTriggerFileInput}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.p_name}
            onChange={(e) => handleInputChange('p_name', e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="product-slug"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            placeholder="SKU-12345"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => handleInputChange('barcode', e.target.value)}
            placeholder="123456789"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input
            id="tax"
            type="number"
            step="0.01"
            value={formData.tax}
            onChange={(e) => handleInputChange('tax', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="discount">Discount ($)</Label>
          <Input
            id="discount"
            type="number"
            step="0.01"
            value={formData.discount}
            onChange={(e) => handleInputChange('discount', e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity_alert">Quantity Alert</Label>
          <Input
            id="quantity_alert"
            type="number"
            value={formData.quantity_alert}
            onChange={(e) => handleInputChange('quantity_alert', parseInt(e.target.value) || 0)}
            placeholder="5"
          />
        </div>
      </div>

      <div className="">
        <div className="grid gap-2">
          <Label htmlFor="store">Store</Label>
          <Select
            value={formData.store_id}
            onValueChange={(value) => handleInputChange('store_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name} - {store.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 mt-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => handleInputChange('category_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};