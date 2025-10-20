// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { CartItem as CartItemType } from "@/types/pos";
// import { Plus, Minus, Trash2 } from "lucide-react";

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (itemId: string, quantity: number) => void;
//   onRemove: (itemId: string) => void;
// }

// export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   const handleQuantityChange = (newQuantity: number) => {
//     if (newQuantity < 1) {
//       onRemove(item.id);
//       return;
//     }
//     if (newQuantity > item.product.stock) {
//       newQuantity = item.product.stock;
//     }
//     onUpdateQuantity(item.id, newQuantity);
//   };

//   return (
//     <div className="flex items-center gap-3 py-3 border-b">
//       {/* Product Info */}
//       <div className="flex-1 min-w-0">
//         <h4 className="font-semibold text-sm truncate">
//           {item.product.name}
//         </h4>
//         <p className="text-sm text-muted-foreground">
//           {formatCurrency(item.product.price)} each
//         </p>
//         {item.notes && (
//           <p className="text-xs text-muted-foreground italic">
//             Note: {item.notes}
//           </p>
//         )}
//       </div>

//       {/* Quantity Controls */}
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleQuantityChange(item.quantity - 1)}
//           className="h-8 w-8 p-0"
//         >
//           <Minus className="h-3 w-3" />
//         </Button>
        
//         <Input
//           type="number"
//           value={item.quantity}
//           onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
//           className="w-12 h-8 text-center"
//           min="1"
//           max={item.product.stock}
//         />
        
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleQuantityChange(item.quantity + 1)}
//           disabled={item.quantity >= item.product.stock}
//           className="h-8 w-8 p-0"
//         >
//           <Plus className="h-3 w-3" />
//         </Button>
//       </div>

//       {/* Price and Remove */}
//       <div className="text-right min-w-20">
//         <div className="font-semibold">
//           {formatCurrency(item.total)}
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => onRemove(item.id)}
//           className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
//         >
//           <Trash2 className="h-3 w-3" />
//         </Button>
//       </div>
//     </div>
//   );
// }