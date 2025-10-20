// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Product } from "@/types/pos";
// import { Plus, Minus } from "lucide-react";

// interface ProductCardProps {
//   product: Product;
//   quantity: number;
//   onAdd: (product: Product) => void;
//   onRemove: (product: Product) => void;
//   onQuantityChange: (product: Product, quantity: number) => void;
// }

// export function ProductCard({ 
//   product, 
//   quantity, 
//   onAdd, 
//   onRemove, 
//   onQuantityChange 
// }: ProductCardProps) {
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   const getStockStatus = (stock: number, minStock: number) => {
//     if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
//     if (stock <= minStock) return { label: 'Low Stock', variant: 'secondary' as const };
//     return { label: 'In Stock', variant: 'default' as const };
//   };

//   const stockStatus = getStockStatus(product.stock, product.minStock);

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
//       <CardContent className="p-4">
//         {/* Product Image */}
//         <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
//           {product.image ? (
//             <img 
//               src={product.image} 
//               alt={product.name}
//               className="object-cover w-full h-full"
//             />
//           ) : (
//             <div className="text-muted-foreground text-sm text-center p-4">
//               No Image
//             </div>
//           )}
//           <Badge 
//             variant={stockStatus.variant} 
//             className="absolute top-2 right-2 text-xs"
//           >
//             {stockStatus.label}
//           </Badge>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-2">
//           <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary">
//             {product.name}
//           </h3>
//           <p className="text-xs text-muted-foreground line-clamp-2">
//             {product.description || 'No description'}
//           </p>
//           <div className="flex items-center justify-between">
//             <span className="font-bold text-lg">
//               {formatCurrency(product.price)}
//             </span>
//             <span className="text-xs text-muted-foreground">
//               Stock: {product.stock}
//             </span>
//           </div>
//         </div>

//         {/* Quantity Controls */}
//         <div className="flex items-center justify-between mt-3">
//           {quantity > 0 ? (
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onRemove(product);
//                 }}
//                 className="h-8 w-8 p-0"
//               >
//                 <Minus className="h-3 w-3" />
//               </Button>
//               <span className="font-semibold min-w-8 text-center">
//                 {quantity}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onAdd(product);
//                 }}
//                 disabled={product.stock <= quantity}
//                 className="h-8 w-8 p-0"
//               >
//                 <Plus className="h-3 w-3" />
//               </Button>
//             </div>
//           ) : (
//             <Button
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onAdd(product);
//               }}
//               disabled={product.stock === 0}
//               className="w-full"
//             >
//               <Plus className="h-4 w-4 mr-1" />
//               Add to Cart
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }