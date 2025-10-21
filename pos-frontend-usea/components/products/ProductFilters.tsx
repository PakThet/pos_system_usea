'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterIcon, SearchIcon, XIcon } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: { cate: string; inStock: string };
  setFilters: React.Dispatch<React.SetStateAction<{ cate: string; inStock: string }>>;
  resetFilters: () => void;
  categories: string[]; // 👈 dynamic from API
}

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  resetFilters,
  categories,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon className="w-4 h-4" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.cate === 'all'}
                onCheckedChange={() => setFilters((prev) => ({ ...prev, cate: 'all' }))}
              >
                All
              </DropdownMenuCheckboxItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filters.cate === category}
                  onCheckedChange={() => setFilters((prev) => ({ ...prev, cate: category }))}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(filters.cate !== 'all' || searchTerm) && (
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <XIcon className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.cate !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.cate}
              <XIcon
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters((p) => ({ ...p, cate: 'all' }))}
              />
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <XIcon className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
