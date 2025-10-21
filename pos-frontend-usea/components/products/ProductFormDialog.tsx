import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { Product, Store } from "@/types/product";
import { Category } from "@/types/category";

interface ProductFormDialogProps {
  open: boolean;
  editingProduct: Product | null;
  loading: boolean;
  categories: Category[];
  stores: Store[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void; 
  onCancel: () => void;
}

export function ProductFormDialog({
  open,
  editingProduct,
  loading,
  categories,
  stores,
  onOpenChange,
  onSubmit,
  onCancel,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          stores={stores}
          onSubmit={onSubmit}
          onCancel={onCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
