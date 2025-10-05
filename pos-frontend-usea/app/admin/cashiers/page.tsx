"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Plus, 
  Filter,
  Users,
  Clock
} from "lucide-react";
import { Cashier, CashierStats, CreateCashierData } from "@/types/cashier";
import { CashiersStats } from "@/components/cashiers-stats";
import { CashiersTable } from "@/components/cashiers-table";
import { CashierDetailsDialog } from "@/components/cashier-details-dialog";
import { CashierForm } from "@/components/cashier-form";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

const mockCashiers: Cashier[] = [
  {
    id: "1",
    employeeId: "CASH-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@store.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    role: "head-cashier",
    shift: "morning",
    hourlyRate: 22.50,
    totalHours: 156,
    totalSales: 125000,
    totalTransactions: 1245,
    lastLogin: new Date('2024-01-15T08:30:00'),
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    permissions: ["process_sales", "handle_returns", "view_reports", "manage_discounts", "void_transactions", "manage_users"]
  },
  {
    id: "2",
    employeeId: "CASH-002",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@store.com",
    phone: "+1 (555) 987-6543",
    status: "on-break",
    role: "senior-cashier",
    shift: "afternoon",
    hourlyRate: 18.75,
    totalHours: 142,
    totalSales: 98000,
    totalTransactions: 987,
    lastLogin: new Date('2024-01-15T14:15:00'),
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-15'),
    permissions: ["process_sales", "handle_returns", "view_reports", "manage_discounts", "void_transactions"]
  },
  {
    id: "3",
    employeeId: "CASH-003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@store.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    role: "cashier",
    shift: "evening",
    hourlyRate: 16.25,
    totalHours: 128,
    totalSales: 75600,
    totalTransactions: 765,
    lastLogin: new Date('2024-01-14T16:45:00'),
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-01-14'),
    permissions: ["process_sales", "handle_returns", "view_reports"]
  },
  {
    id: "4",
    employeeId: "CASH-004",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@store.com",
    phone: "+1 (555) 321-0987",
    status: "inactive",
    role: "cashier",
    shift: "night",
    hourlyRate: 17.50,
    totalHours: 95,
    totalSales: 45200,
    totalTransactions: 432,
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2024-01-10'),
    permissions: ["process_sales", "handle_returns"]
  }
];

const mockStats: CashierStats = {
  total: 24,
  active: 18,
  onBreak: 3,
  totalSales: 452800,
  totalTransactions: 4256,
  averageTransaction: 106.45
};



export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>(mockCashiers);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewCashier = (cashier: Cashier) => {
    setSelectedCashier(cashier);
    setShowDetails(true);
  };

  const handleEditCashier = (cashier: Cashier) => {
    setEditingCashier(cashier);
    setShowForm(true);
  };

  useEffect(()=>{
    const fetchData = async()=>{
      if(!USE_API){
        
      }
    }
  }, [])

  const handleStatusChange = (cashierId: string, status: Cashier['status']) => {
    setCashiers(prev =>
      prev.map(cashier =>
        cashier.id === cashierId
          ? { ...cashier, status, updatedAt: new Date() }
          : cashier
      )
    );
  };

  const handleCreateCashier = async (data: CreateCashierData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCashier: Cashier = {
      id: Date.now().toString(),
      employeeId: `CASH-${String(cashiers.length + 1).padStart(3, '0')}`,
      ...data,
      status: "active",
      totalHours: 0,
      totalSales: 0,
      totalTransactions: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCashiers(prev => [...prev, newCashier]);
    setShowForm(false);
    setIsLoading(false);
  };

  const handleUpdateCashier = async (data: CreateCashierData) => {
    if (!editingCashier) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCashiers(prev =>
      prev.map(cashier =>
        cashier.id === editingCashier.id
          ? { 
              ...cashier, 
              ...data, 
              updatedAt: new Date() 
            }
          : cashier
      )
    );
    
    setEditingCashier(null);
    setShowForm(false);
    setIsLoading(false);
  };

  const handleExportCashiers = () => {
    // Implement export functionality
    console.log('Export cashiers');
  };

  const handleScheduleManagement = () => {
    // Implement schedule management
    console.log('Manage schedules');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCashier(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Cashiers
          </h1>
          <p className="text-muted-foreground">
            Manage your cashier team and their schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScheduleManagement}>
            <Clock className="h-4 w-4 mr-2" />
            Schedules
          </Button>
          <Button variant="outline" onClick={handleExportCashiers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Cashier
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <CashiersStats stats={mockStats} />

      {/* Cashiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cashier Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CashiersTable
            cashiers={cashiers}
            onView={handleViewCashier}
            onEdit={handleEditCashier}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      {/* Cashier Details Dialog */}
      <CashierDetailsDialog
        cashier={selectedCashier}
        open={showDetails}
        onOpenChange={setShowDetails}
        onEdit={handleEditCashier}
      />

      {/* Cashier Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCashier ? "Edit Cashier" : "Add New Cashier"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CashierForm
              cashier={editingCashier || undefined}
              onSubmit={editingCashier ? handleUpdateCashier : handleCreateCashier}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}