'use client';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePenIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { Product } from '@/types/product';

interface Props {
  products: Product[];
  filtered: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, filtered, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Inventory</CardTitle>
        <span className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </span>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <div className="font-semibold">{p.p_name}</div>
                          <div className="text-sm text-muted-foreground">{p.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>{p.quantity > 0 ? 'In Stock' : 'Out of Stock'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.cate}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(p)}>
                          <FilePenIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(p)}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <SearchIcon className="mx-auto w-10 h-10 text-muted-foreground mb-2" />
                    <p>No products found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing {filtered.length} of {products.length} products
      </CardFooter>
    </Card>
  );
}
