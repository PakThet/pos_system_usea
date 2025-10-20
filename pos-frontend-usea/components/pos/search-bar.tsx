// components/pos/search-bar.tsx
'use client';

import React from 'react';
import { Search, Scan } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBarcodeScan: () => void;
}

export function SearchBar({ value, onChange, onBarcodeScan }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search products by name, SKU, or barcode..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-20"
      />
      <button
        onClick={onBarcodeScan}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <Scan className="w-4 h-4" />
      </button>
    </div>
  );
}