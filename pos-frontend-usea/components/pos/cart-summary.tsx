import { CartItem as CartItemType } from "@/types/pos";
import { CartItem } from "./cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}: CartSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = items.reduce((sum, item) => sum + item.tax, 0);
  const discount = items.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal + tax - discount;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">
          Add some products to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Current Order</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCart}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Cart Totals */}
      <div className="border-t p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <Button
          onClick={onCheckout}
          className="w-full h-12 text-lg"
          size="lg"
        >
          Checkout ({items.length} items)
        </Button>
      </div>
    </div>
  );
}