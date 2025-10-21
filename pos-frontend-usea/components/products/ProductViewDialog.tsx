import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types/product';

interface ProductViewDialogProps {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewDialog({ open, product, onOpenChange }: ProductViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{product.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">SKU</h3>
                <p>{product.sku}</p>
              </div>
              <div>
                <h3 className="font-semibold">Price</h3>
                <p>${parseFloat(product.price).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Quantity</h3>
                <p>{product.quantity}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{product.category.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{product.status}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}