'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function ProductHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>
      <Button onClick={onAdd} className="sm:w-auto w-full">
        <PlusIcon className="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>
  );
}
