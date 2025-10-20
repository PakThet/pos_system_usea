// import { Product } from "@/types/pos";
// import { ProductCard } from "./product-card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, SlidersHorizontal } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface ProductGridProps {
//   products: Product[];
//   cartItems: Map<string, number>;
//   onAddToCart: (product: Product) => void;
//   onRemoveFromCart: (product: Product) => void;
//   onQuantityChange: (product: Product, quantity: number) => void;
//   categories: string[];
//   selectedCategory: string;
//   onCategoryChange: (category: string) => void;
//   searchTerm: string;
//   onSearchChange: (term: string) => void;
// }

// export function ProductGrid({
//   products,
//   cartItems,
//   onAddToCart,
//   onRemoveFromCart,
//   onQuantityChange,
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   searchTerm,
//   onSearchChange
// }: ProductGridProps) {
//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="flex flex-col h-full">
//       {/* Search and Filters */}
//       <div className="space-y-4 p-4 border-b">
//         <div className="relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="pl-10"
//           />
//         </div>
        
//         <div className="flex items-center gap-2">
//           <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
//           <div className="flex gap-1 overflow-x-auto">
//             <Button
//               variant={selectedCategory === 'all' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => onCategoryChange('all')}
//             >
//               All
//             </Button>
//             {categories.map(category => (
//               <Button
//                 key={category}
//                 variant={selectedCategory === category ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => onCategoryChange(category)}
//               >
//                 {category}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <ScrollArea className="flex-1 p-4">
//         {filteredProducts.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-muted-foreground">
//               No products found. Try a different search or category.
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredProducts.map(product => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//                 quantity={cartItems.get(product.id) || 0}
//                 onAdd={onAddToCart}
//                 onRemove={onRemoveFromCart}
//                 onQuantityChange={onQuantityChange}
//               />
//             ))}
//           </div>
//         )}
//       </ScrollArea>
//     </div>
//   );
// }