"use client";

import { useState, useRef, useEffect } from "react";
import { Product, Category, Store, CreateProductData } from "@/types/product";
import { PageHeader } from "@/components/products/PageHeader";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteConfirmationDialog } from "@/components/products/DeleteConfirmationDialog";
import { 
  fetchProducts, 
  fetchCategories, 
  fetchStores, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  transformToApiProductFormat 
} from "@/lib/api-utils";
import { mockProducts, mockCategories, mockStores } from "@/lib/mock-data";
import { LoadingSpinner } from "@/components/products/LoadingSpinner";
import { ErrorAlert } from "@/components/products/ErrorAlert";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "all", inStock: "all" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState<CreateProductData>({
    image: "",
    store_id: "",
    category_id: "",
    p_name: "",
    slug: "",
    sku: "",
    barcode: "",
    description: "",
    quantity: 0,
    price: "",
    tax: "",
    discount: "",
    quantity_alert: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!USE_API) {
          // Use mock data
          setProducts(mockProducts);
          setCategories(mockCategories);
          setStores(mockStores);
        } else {
          const [productsData, categoriesData, storesData] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchStores()
          ]);

          setProducts(productsData);
          setCategories(categoriesData);
          setStores(storesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setProducts([]);
        setCategories([]);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshFlag]);

  const resetSelectedProduct = () => {
    setSelectedProduct(null);
    setImagePreview(null);
    setNewProduct({
      image: "",
      store_id: "",
      category_id: "",
      p_name: "",
      slug: "",
      sku: "",
      barcode: "",
      description: "",
      quantity: 0,
      price: "",
      tax: "",
      discount: "",
      quantity_alert: 0
    });
  };

  const resetFilters = () => {
    setFilters({ category: "all", inStock: "all" });
    setSearchTerm("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUploadingImage(true);
      
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setImagePreview(imageUrl);
          
          if (isAddProductDialogOpen) {
            setNewProduct(prev => ({ ...prev, image: imageUrl }));
          } else if (selectedProduct) {
            setSelectedProduct(prev => prev ? { ...prev, image: imageUrl } : null);
          }
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    if (isAddProductDialogOpen) {
      setNewProduct(prev => ({ ...prev, image: "" }));
    } else if (selectedProduct) {
      setSelectedProduct(prev => prev ? { ...prev, image: "" } : null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.p_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || product.category_id === filters.category;
    const matchesStock =
      filters.inStock === "all" ||
      (filters.inStock === "in" && product.quantity > 0) ||
      (filters.inStock === "out" && product.quantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = async () => {
    if (newProduct.p_name && newProduct.description && newProduct.price && newProduct.category_id) {
      setSubmitting(true);
      setError(null);
      try {
        if (!USE_API) {
          // Mock implementation
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newProductData: Product = {
            id: Date.now().toString(),
            ...newProduct,
            tax: Number(newProduct.tax),
            discount: Number(newProduct.discount),
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
            store: stores.find(s => s.id === newProduct.store_id),
            category: categories.find(c => c.id === newProduct.category_id)
          };
          setProducts(prev => [...prev, newProductData]);
          setIsAddProductDialogOpen(false);
          resetSelectedProduct();
        } else {
          const formData = new FormData();
          
          // Append all product data
          const apiData = transformToApiProductFormat(newProduct);
          Object.entries(apiData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value.toString());
            }
          });

          // Append image file if exists
          if (fileInputRef.current?.files?.[0]) {
            formData.append('image', fileInputRef.current.files[0]);
          }

          const createdProduct = await createProduct(formData);
          setProducts(prev => [...prev, createdProduct]);
          setIsAddProductDialogOpen(false);
          resetSelectedProduct();
          setRefreshFlag(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        setError(error instanceof Error ? error.message : 'Failed to add product');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      setSubmitting(true);
      setError(null);
      try {
        if (!USE_API) {
          // Mock implementation
          await new Promise(resolve => setTimeout(resolve, 1000));
          setProducts(prev => prev.map(p => 
            p.id === selectedProduct.id 
              ? { ...selectedProduct, updatedAt: new Date().toDateString() }
              : p
          ));
          setIsEditProductDialogOpen(false);
          resetSelectedProduct();
        } else {
          const formData = new FormData();
          
          const updateData: CreateProductData = {
            store_id: selectedProduct.store_id,
            category_id: selectedProduct.category_id,
            p_name: selectedProduct.p_name,
            slug: selectedProduct.slug,
            sku: selectedProduct.sku,
            barcode: selectedProduct.barcode,
            description: selectedProduct.description,
            quantity: selectedProduct.quantity,
            price: selectedProduct.price,
            tax: selectedProduct.tax.toString(),
            discount: selectedProduct.discount.toString(),
            quantity_alert: selectedProduct.quantity_alert,
            image: selectedProduct.image || ""
          };

          const apiData = transformToApiProductFormat(updateData);
          Object.entries(apiData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value.toString());
            }
          });
          formData.append('_method', 'PUT');

          // Append image file if exists
          if (fileInputRef.current?.files?.[0]) {
            formData.append('image', fileInputRef.current.files[0]);
          }

          const updatedProduct = await updateProduct(selectedProduct.id, formData);
          setProducts(prev => prev.map(p => 
            p.id === selectedProduct.id ? updatedProduct : p
          ));
          setIsEditProductDialogOpen(false);
          resetSelectedProduct();
          setRefreshFlag(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        setError(error instanceof Error ? error.message : 'Failed to update product');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      setSubmitting(true);
      setError(null);
      try {
        if (!USE_API) {
          // Mock implementation
          await new Promise(resolve => setTimeout(resolve, 500));
          setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
          setIsDeleteConfirmationOpen(false);
          setProductToDelete(null);
        } else {
          await deleteProduct(productToDelete.id);
          setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
          setIsDeleteConfirmationOpen(false);
          setProductToDelete(null);
          setRefreshFlag(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete product');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setImagePreview(product.image || null);
    setIsEditProductDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteConfirmationOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      <PageHeader onAddProduct={() => setIsAddProductDialogOpen(true)} />

      <ProductFilters
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
      />

      <ProductTable
        products={filteredProducts}
        categories={categories}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteClick}
      />

      <ProductDialog
        open={isAddProductDialogOpen || isEditProductDialogOpen}
        isAdd={isAddProductDialogOpen}
        product={selectedProduct}
        formData={isAddProductDialogOpen ? newProduct : {
          image: selectedProduct?.image || "",
          store_id: selectedProduct?.store_id || "",
          category_id: selectedProduct?.category_id || "",
          p_name: selectedProduct?.p_name || "",
          slug: selectedProduct?.slug || "",
          sku: selectedProduct?.sku || "",
          barcode: selectedProduct?.barcode || "",
          description: selectedProduct?.description || "",
          quantity: selectedProduct?.quantity || 0,
          price: selectedProduct?.price || "",
          tax: selectedProduct?.tax.toString() || "",
          discount: selectedProduct?.discount.toString() || "",
          quantity_alert: selectedProduct?.quantity_alert || 0
        }}
        categories={categories}
        stores={stores}
        imagePreview={imagePreview}
        uploadingImage={uploadingImage}
        submitting={submitting}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddProductDialogOpen(false);
            setIsEditProductDialogOpen(false);
            resetSelectedProduct();
          }
        }}
        onFormDataChange={isAddProductDialogOpen ? setNewProduct : (data) => {
          if (selectedProduct) {
            setSelectedProduct({
              ...selectedProduct,
              ...data,
              tax: parseFloat(data.tax) || 0,
              discount: parseFloat(data.discount) || 0
            });
          }
        }}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        onTriggerFileInput={triggerFileInput}
        onSubmit={isAddProductDialogOpen ? handleAddProduct : handleUpdateProduct}
        onCancel={() => {
          setIsAddProductDialogOpen(false);
          setIsEditProductDialogOpen(false);
          resetSelectedProduct();
        }}
      />

      <DeleteConfirmationDialog
        open={isDeleteConfirmationOpen}
        product={productToDelete}
        submitting={submitting}
        onOpenChange={setIsDeleteConfirmationOpen}
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setIsDeleteConfirmationOpen(false);
          setProductToDelete(null);
        }}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}