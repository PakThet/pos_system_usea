"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FilePenIcon, FilterIcon, Loader2Icon, PlusIcon, SearchIcon, TrashIcon, XIcon, UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: number;
  image: string;
  store: string;
  warehouse: string;
  p_name: string;
  slug: string;
  sku: string;
  cate: string;
  barcode: string;
  desc: string;
  quantity: number;
  price: number;
  tax: number;
  discount_value?: number;
  quantity_alert: number;
};

const mockProducts: Product[] = [
  {
    id: 1,
    image: "/cate.jpg",
    store: "Main Store",
    warehouse: "Central Warehouse",
    p_name: "Wireless Mouse",
    slug: "wireless-mouse",
    sku: "WM-12345",
    cate: "Electronics",
    barcode: "1234567890123",
    desc: "Ergonomic wireless mouse with USB receiver",
    quantity: 50,
    price: 25.99,
    tax: 10,
    discount_value: 5,
    quantity_alert: 10
  },
  {
    id: 2,
    image: "/cate.jpg",
    store: "Main Store",
    warehouse: "Central Warehouse",
    p_name: "Bluetooth Headphones",
    slug: "bluetooth-headphones",
    sku: "BH-67890",
    cate: "Electronics",
    barcode: "1234567890456",
    desc: "Noise-canceling over-ear headphones",
    quantity: 20,
    price: 89.5,
    tax: 10,
    discount_value: 5,
    quantity_alert: 5
  },
  {
    id: 3,
    image: "/cate.jpg",
    store: "Outlet Store",
    warehouse: "Branch Warehouse",
    p_name: "Coffee Mug",
    slug: "coffee-mug",
    sku: "CM-24680",
    cate: "Kitchen",
    barcode: "1234567890789",
    desc: "Ceramic coffee mug, 350ml",
    quantity: 0,
    price: 12.0,
    tax: 0,
    quantity_alert: 5
  },
  {
    id: 4,
    image: "/cate.jpg",
    store: "Main Store",
    warehouse: "Central Warehouse",
    p_name: "Notebook",
    slug: "notebook",
    sku: "NB-13579",
    cate: "Stationery",
    barcode: "12345678",
    desc: "200-page lined notebook",
    quantity: 100,
    price: 5.5,
    tax: 5,
    discount_value: 10,
    quantity_alert: 20
  },
  {
    id: 5,
    image: "/cate.jpg",
    store: "Main Store",
    warehouse: "Central Warehouse",
    p_name: "Desk Lamp",
    slug: "desk-lamp",
    sku: "DL-cate223",
    cate: "Furniture",
    barcode: "1234567890674",
    desc: "LED desk lamp with adjustable brightness",
    quantity: 15,
    price: 32.99,
    tax: 10,
    discount_value: 3,
    quantity_alert: 5
  }
];

const categories = ["All", "Electronics", "Kitchen", "Stationery", "Furniture"];
const stores = ["Main Store", "Outlet Store"];
const warehouses = ["Central Warehouse", "Branch Warehouse"];

const Page = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ cate: "all", inStock: "all" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    image: "",
    store: "",
    warehouse: "",
    p_name: "",
    slug: "",
    sku: "",
    cate: "",
    barcode: "",
    desc: "",
    quantity: "",
    price: "",
    tax: "",
    discount_value: "",
    quantity_alert: ""
  });

  const resetSelectedProduct = () => {
    setSelectedProduct(null);
    setImagePreview(null);
    setNewProduct({
      image: "",
      store: "",
      warehouse: "",
      p_name: "",
      slug: "",
      sku: "",
      cate: "",
      barcode: "",
      desc: "",
      quantity: "",
      price: "",
      tax: "",
      discount_value: "",
      quantity_alert: ""
    });
  };

  const resetFilters = () => {
    setFilters({ cate: "all", inStock: "all" });
    setSearchTerm("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUploadingImage(true);
      
      // Simulate file upload
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
    const matchesSearch = product.p_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.cate === "all" || product.cate === filters.cate;
    const matchesStock =
      filters.inStock === "all" ||
      (filters.inStock === "in" && product.quantity > 0) ||
      (filters.inStock === "out" && product.quantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = () => {
    if (newProduct.p_name && newProduct.desc && newProduct.price && newProduct.cate) {
      const product: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        image: newProduct.image || "/placeholder.jpg",
        store: newProduct.store || "Main Store",
        warehouse: newProduct.warehouse || "Central Warehouse",
        p_name: newProduct.p_name,
        slug: newProduct.slug || newProduct.p_name.toLowerCase().replace(/\s+/g, '-'),
        sku: newProduct.sku || `SKU-${Date.now()}`,
        cate: newProduct.cate,
        barcode: newProduct.barcode || `BC-${Date.now()}`,
        desc: newProduct.desc,
        quantity: parseInt(newProduct.quantity) || 0,
        price: parseFloat(newProduct.price) || 0,
        tax: parseFloat(newProduct.tax) || 0,
        discount_value: newProduct.discount_value ? parseFloat(newProduct.discount_value) : undefined,
        quantity_alert: parseInt(newProduct.quantity_alert) || 5
      };
      setProducts([...products, product]);
      setIsAddProductDialogOpen(false);
      resetSelectedProduct();
    }
  };

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? selectedProduct : p
      ));
      setIsEditProductDialogOpen(false);
      resetSelectedProduct();
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteConfirmationOpen(false);
      setProductToDelete(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const updateSelectedProductField = (field: keyof Product, value: any) => {
    setSelectedProduct(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Set image preview when editing a product
  useState(() => {
    if (selectedProduct && selectedProduct.image) {
      setImagePreview(selectedProduct.image);
    }
  });

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2Icon className="mx-auto h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsAddProductDialogOpen(true)} className="sm:w-auto w-full">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products by name, description, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FilterIcon className="w-4 h-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={filters.cate === category.toLowerCase() || (category === "All" && filters.cate === "all")}
                    onCheckedChange={() => setFilters((prev) => ({ 
                      ...prev, 
                      cate: category === "All" ? "all" : category 
                    }))}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Stock Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.inStock === "all"}
                  onCheckedChange={() => setFilters((prev) => ({ ...prev, inStock: "all" }))}
                >
                  All Stock
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.inStock === "in"}
                  onCheckedChange={() => setFilters((prev) => ({ ...prev, inStock: "in" }))}
                >
                  In Stock Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.inStock === "out"}
                  onCheckedChange={() => setFilters((prev) => ({ ...prev, inStock: "out" }))}
                >
                  Out of Stock
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(filters.cate !== "all" || filters.inStock !== "all" || searchTerm) && (
              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <XIcon className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.cate !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {filters.cate}
                <XIcon 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, cate: "all" }))}
                />
              </Badge>
            )}
            {filters.inStock !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Stock: {filters.inStock === "in" ? "In Stock" : "Out of Stock"}
                <XIcon 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, inStock: "all" }))}
                />
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <XIcon 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Inventory</CardTitle>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[270px]">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[120px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-6">
                            <img 
                              src={product.image} 
                              alt={product.p_name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.p_name}</div>
                              <div className="text-sm text-muted-foreground">{product.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{product.store}</div>
                            <div className="text-muted-foreground">{product.warehouse}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${product.price.toFixed(2)}
                          {product.discount_value && (
                            <div className="text-xs text-green-600">
                              -${product.discount_value} off
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({product.quantity})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.cate}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setSelectedProduct(product);
                                setImagePreview(product.image);
                                setIsEditProductDialogOpen(true);
                              }}
                            >
                              <FilePenIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setProductToDelete(product);
                                setIsDeleteConfirmationOpen(true);
                              }}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <SearchIcon className="w-12 h-12 text-muted-foreground" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                        {(filters.cate !== "all" || filters.inStock !== "all" || searchTerm) && (
                          <Button variant="outline" onClick={resetFilters}>
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardFooter>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={isAddProductDialogOpen || isEditProductDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddProductDialogOpen(false);
            setIsEditProductDialogOpen(false);
            resetSelectedProduct();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddProductDialogOpen ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {isAddProductDialogOpen
                ? "Enter the details of the new product."
                : "Edit the details of the product."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Image Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={removeImage}
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center">
                    {uploadingImage ? (
                      <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                      <UploadIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                )}
                
                <div className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={triggerFileInput}
                    disabled={uploadingImage}
                    className="w-full"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={isAddProductDialogOpen ? newProduct.p_name : selectedProduct?.p_name || ""}
                  onChange={(e) => isAddProductDialogOpen 
                    ? setNewProduct({...newProduct, p_name: e.target.value})
                    : updateSelectedProductField('p_name', e.target.value)
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={isAddProductDialogOpen ? newProduct.slug : selectedProduct?.slug || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, slug: e.target.value})
                    : updateSelectedProductField('slug', e.target.value)
                  }
                  placeholder="product-slug"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={isAddProductDialogOpen ? newProduct.sku : selectedProduct?.sku || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, sku: e.target.value})
                    : updateSelectedProductField('sku', e.target.value)
                  }
                  placeholder="SKU-12345"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={isAddProductDialogOpen ? newProduct.barcode : selectedProduct?.barcode || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, barcode: e.target.value})
                    : updateSelectedProductField('barcode', e.target.value)
                  }
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={isAddProductDialogOpen ? newProduct.desc : selectedProduct?.desc || ""}
                onChange={(e) => isAddProductDialogOpen
                  ? setNewProduct({...newProduct, desc: e.target.value})
                  : updateSelectedProductField('desc', e.target.value)
                }
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
                  value={isAddProductDialogOpen ? newProduct.price : selectedProduct?.price || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, price: e.target.value})
                    : updateSelectedProductField('price', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={isAddProductDialogOpen ? newProduct.tax : selectedProduct?.tax || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, tax: e.target.value})
                    : updateSelectedProductField('tax', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={isAddProductDialogOpen ? newProduct.discount_value : selectedProduct?.discount_value || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, discount_value: e.target.value})
                    : updateSelectedProductField('discount_value', parseFloat(e.target.value) || 0)
                  }
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
                  value={isAddProductDialogOpen ? newProduct.quantity : selectedProduct?.quantity || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, quantity: e.target.value})
                    : updateSelectedProductField('quantity', parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity_alert">Quantity Alert</Label>
                <Input
                  id="quantity_alert"
                  type="number"
                  value={isAddProductDialogOpen ? newProduct.quantity_alert : selectedProduct?.quantity_alert || ""}
                  onChange={(e) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, quantity_alert: e.target.value})
                    : updateSelectedProductField('quantity_alert', parseInt(e.target.value) || 0)
                  }
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="store">Store</Label>
                <Select
                  value={isAddProductDialogOpen ? newProduct.store : selectedProduct?.store || ""}
                  onValueChange={(value) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, store: value})
                    : updateSelectedProductField('store', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select
                  value={isAddProductDialogOpen ? newProduct.warehouse : selectedProduct?.warehouse || ""}
                  onValueChange={(value) => isAddProductDialogOpen
                    ? setNewProduct({...newProduct, warehouse: value})
                    : updateSelectedProductField('warehouse', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={isAddProductDialogOpen ? newProduct.cate : selectedProduct?.cate || ""}
                onValueChange={(value) => isAddProductDialogOpen
                  ? setNewProduct({...newProduct, cate: value})
                  : updateSelectedProductField('cate', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat !== "All").map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddProductDialogOpen(false);
                setIsEditProductDialogOpen(false);
                resetSelectedProduct();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={isAddProductDialogOpen ? handleAddProduct : handleUpdateProduct}
              disabled={!newProduct.p_name && !selectedProduct?.p_name}
            >
              {isAddProductDialogOpen ? "Add Product" : "Update Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrashIcon className="w-5 h-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {productToDelete?.p_name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;