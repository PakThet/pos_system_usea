import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SalesFilter } from "@/types/sale";
import { Calendar, Filter, Download } from "lucide-react";

interface SalesFiltersProps {
  filters: SalesFilter;
  onFiltersChange: (filters: SalesFilter) => void;
  onExport: () => void;
}

export function SalesFilters({ filters, onFiltersChange, onExport }: SalesFiltersProps) {
  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const paymentMethods = [
    { value: 'all', label: 'All Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'credit', label: 'Credit' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border-b">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Period Selector */}
        <Select
          value={filters.period}
          onValueChange={(value: SalesFilter['period']) => 
            onFiltersChange({ ...filters, period: value })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map(period => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Method Filter */}
        <Select
          value={filters.paymentMethod || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, paymentMethod: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map(method => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <Input
          placeholder="Search transactions..."
          className="w-full sm:w-[200px]"
          onChange={(e) => {
            // Add search functionality if needed
          }}
        />
      </div>

      {/* Export Button */}
      <Button variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export Report
      </Button>
    </div>
  );
}