import { Button } from "@/components/ui/button";
import { Download, Plus, Users } from "lucide-react";

interface PageHeaderProps {
  onAddCustomer: () => void;
  onExportCustomers: () => void;
}

export const PageHeader = ({ onAddCustomer, onExportCustomers }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Customers
        </h1>
        <p className="text-muted-foreground">
          Manage your customer relationships and data
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCustomers}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onAddCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};