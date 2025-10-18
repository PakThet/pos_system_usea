import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Product, Category, Store, CreateProductData } from "@/types/product";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
  open: boolean;
  isAdd: boolean;
  product: Product | null;
  formData: CreateProductData;
  categories: Category[];
  stores: Store[];
  imagePreview: string | null;
  uploadingImage: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onFormDataChange: (data: CreateProductData) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onTriggerFileInput: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ProductDialog = ({
  open,
  isAdd,
  product,
  formData,
  categories,
  stores,
  imagePreview,
  uploadingImage,
  submitting,
  onOpenChange,
  onFormDataChange,
  onImageUpload,
  onRemoveImage,
  onTriggerFileInput,
  onSubmit,
  onCancel,
}: ProductDialogProps) => {
  const isFormValid = formData.p_name && formData.description && formData.price && formData.category_id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAdd ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {isAdd
              ? "Enter the details of the new product."
              : "Edit the details of the product."}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          product={product}
          formData={formData}
          categories={categories}
          stores={stores}
          imagePreview={imagePreview}
          uploadingImage={uploadingImage}
          onFormDataChange={onFormDataChange}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onTriggerFileInput={onTriggerFileInput}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!isFormValid || submitting}
          >
            {submitting ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                {isAdd ? "Adding..." : "Updating..."}
              </>
            ) : (
              isAdd ? "Add Product" : "Update Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};