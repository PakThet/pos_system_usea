import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilePenIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Category, Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
  if (stock < 10) return { label: "Low Stock", variant: "secondary" as const };
  return { label: "In Stock", variant: "default" as const };
};

export const ProductTable = ({ 
  products, 
  categories,
  onEditProduct, 
  onDeleteProduct 
}: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <SearchIcon className="w-12 h-12 text-muted-foreground" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Inventory</CardTitle>
        <span className="text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 ? 's' : ''} found
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
              {products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                const category = categories.find(c => c.id === product.category_id);
                
                return (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-6">
                        <img 
                          src={product.image || "/placeholder.jpg"} 
                          alt={product.p_name}
                          className="w-10 h-10 rounded-md object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                          }}
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
                        <div>{product.store?.name}</div>
                        <div className="text-muted-foreground">{product.store?.location}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${product.price}
{product.discount && Number(product.discount) > 0 && (
  <div className="text-xs text-green-600">
    -${Number(product.discount).toFixed(2)} off
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
                      <Badge variant="outline">{category?.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditProduct(product)}
                        >
                          <FilePenIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteProduct(product)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {products.length} products
        </div>
      </CardFooter>
    </Card>
  );
};