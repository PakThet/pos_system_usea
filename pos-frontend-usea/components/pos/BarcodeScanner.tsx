// components/pos/BarcodeScanner.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan } from "lucide-react";
import { Product } from '@/types/pos';

interface BarcodeScannerProps {
  barcodeInput: string;
  onBarcodeInputChange: (value: string) => void;
  onBarcodeSearch: () => void;
  products: Product[];
}

export const BarcodeScanner = ({
  barcodeInput,
  onBarcodeInputChange,
  onBarcodeSearch,
  products
}: BarcodeScannerProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBarcodeSearch();
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
            <Input
              placeholder="Scan barcode or enter product name/SKU..."
              value={barcodeInput}
              onChange={(e) => onBarcodeInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-blue-200 focus:border-blue-300"
            />
          </div>
          <Button 
            onClick={onBarcodeSearch}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Scan className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};