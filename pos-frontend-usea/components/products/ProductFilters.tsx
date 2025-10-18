import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { Category } from "@/types/product";

interface ProductFiltersProps {
  categories: Category[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: { category: string; inStock: string };
  onFiltersChange: (filters: { category: string; inStock: string }) => void;
  onResetFilters: () => void;
}

export const ProductFilters = ({
  categories,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onResetFilters,
}: ProductFiltersProps) => {
  const hasActiveFilters = filters.category !== "all" || filters.inStock !== "all" || searchTerm;

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
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
              <DropdownMenuCheckboxItem
                checked={filters.category === "all"}
                onCheckedChange={() => onFiltersChange({ ...filters, category: "all" })}
              >
                All Categories
              </DropdownMenuCheckboxItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={filters.category === category.id}
                  onCheckedChange={() => onFiltersChange({ ...filters, category: category.id })}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Stock Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.inStock === "all"}
                onCheckedChange={() => onFiltersChange({ ...filters, inStock: "all" })}
              >
                All Stock
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.inStock === "in"}
                onCheckedChange={() => onFiltersChange({ ...filters, inStock: "in" })}
              >
                In Stock Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.inStock === "out"}
                onCheckedChange={() => onFiltersChange({ ...filters, inStock: "out" })}
              >
                Out of Stock
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="outline" onClick={onResetFilters} className="gap-2">
              <XIcon className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === filters.category)?.name}
              <XIcon 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, category: "all" })}
              />
            </Badge>
          )}
          {filters.inStock !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Stock: {filters.inStock === "in" ? "In Stock" : "Out of Stock"}
              <XIcon 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, inStock: "all" })}
              />
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <XIcon 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};