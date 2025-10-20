"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Plus, 
  Filter,
  Users,
  Clock,
  RefreshCw
} from "lucide-react";
import { Cashier, CashierStats, CreateCashierData } from "@/types/cashier";
import { toast } from "sonner";
import { cashierApi } from "@/services/cashierApi";
import { CashiersStats } from "@/components/cashiers/cashiers-stats";
import { CashiersTable } from "@/components/cashiers/cashiers-table";
import { CashierDetailsDialog } from "@/components/cashiers/cashier-details-dialog";
import { CashierForm } from "@/components/cashiers/cashier-form";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

// Transform API cashier to app cashier format
const transformApiCashier = (apiCashier: any): Cashier => ({
  id: apiCashier.id.toString(),
  employee_id: apiCashier.employee_id,
  first_name: apiCashier.first_name,
  last_name: apiCashier.last_name,
  email: apiCashier.email,
  phone: apiCashier.phone || undefined,
  status: apiCashier.status,
  role: apiCashier.role,
  shift: apiCashier.shift,
  hourly_rate: parseFloat(apiCashier.hourly_rate),
  total_hours: apiCashier.total_hours || 0,
  total_sales: parseFloat(apiCashier.total_sales) || 0,
  total_transactions: apiCashier.total_transactions || 0,
  last_login_at: apiCashier.last_login_at || undefined,
  permissions: Array.isArray(apiCashier.permissions)
    ? apiCashier.permissions
    : JSON.parse(apiCashier.permissions || '[]'), 
  created_at: apiCashier.created_at,
  updated_at: apiCashier.updated_at,
});


export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [stats, setStats] = useState<CashierStats | null>(null);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch cashiers and stats on component mount
  useEffect(() => {
    fetchCashiers();
    // fetchStats();
  }, []);

  const fetchCashiers = async () => {
    try {
      setIsRefreshing(true);
      
     
        const response = await cashierApi.getCashiers();
        if (response.success) {
          const transformedCashiers = response.data.map(transformApiCashier);
          setCashiers(transformedCashiers);
        } else {
          console.error('Failed to fetch cashiers:', response.message);
          toast.error('Failed to fetch cashiers');
        }
      
    } catch (error) {
      console.error('Error fetching cashiers:', error);
      toast.error('Failed to fetch cashiers');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewCashier = (cashier: Cashier) => {
    setSelectedCashier(cashier);
    setShowDetails(true);
  };

  const handleEditCashier = (cashier: Cashier) => {
    setEditingCashier(cashier);
    setShowForm(true);
  };

  const handleStatusChange = async (cashierId: string, status: Cashier['status']) => {
    try {
      
        const response = await cashierApi.updateCashierStatus(cashierId, status);
        if (response.success) {
          const updatedCashier = transformApiCashier(response.data);
          setCashiers(prev =>
            prev.map(cashier =>
              cashier.id === cashierId ? updatedCashier : cashier
            )
          );
          toast.success('Cashier status updated successfully');
          // Refresh stats to get updated counts
          // fetchStats();
        } else {
          console.error('Failed to update cashier status:', response.message);
          toast.error('Failed to update cashier status');
        }
      
    } catch (error) {
      console.error('Error updating cashier status:', error);
      toast.error('Failed to update cashier status');
    }
  };

  const handleCreateCashier = async (data: CreateCashierData) => {
  setIsLoading(true);
  try {
    
      const response = await cashierApi.createCashier(data);
      if (response.success) {
        const newCashier = transformApiCashier(response.data);
        setCashiers(prev => [...prev, newCashier]);
        setShowForm(false);
        toast.success('Cashier created successfully');
        // Refresh stats to get updated counts
        // fetchStats();
      } else {
        console.error('Failed to create cashier:', response.message);
        toast.error('Failed to create cashier');
      }
    
  } catch (error) {
    console.error('Error creating cashier:', error);
    toast.error('Failed to create cashier');
  } finally {
    setIsLoading(false);
  }
};


  const handleUpdateCashier = async (data: CreateCashierData) => {
    if (!editingCashier) return;
    
    setIsLoading(true);
    try {
      
        const response = await cashierApi.updateCashier(editingCashier.id, data);
        if (response.success) {
          const updatedCashier = transformApiCashier(response.data);
          setCashiers(prev =>
            prev.map(cashier =>
              cashier.id === editingCashier.id ? updatedCashier : cashier
            )
          );
          setEditingCashier(null);
          setShowForm(false);
          toast.success('Cashier updated successfully');
        } else {
          console.error('Failed to update cashier:', response.message);
          toast.error('Failed to update cashier');
        }
      
    } catch (error) {
      console.error('Error updating cashier:', error);
      toast.error('Failed to update cashier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCashier = async (cashierId: string) => {
    try {
      
        const response = await cashierApi.deleteCashier(cashierId);
        if (response.success) {
          setCashiers(prev => prev.filter(cashier => cashier.id !== cashierId));
          toast.success('Cashier deleted successfully');
          // Refresh stats to get updated counts
          // fetchStats();
        } else {
          console.error('Failed to delete cashier:', response.message);
          toast.error('Failed to delete cashier');
        }
      
    } catch (error) {
      console.error('Error deleting cashier:', error);
      toast.error('Failed to delete cashier');
    }
  };

  const handleRecordLogin = async (cashierId: string) => {
    try {
      
        const response = await cashierApi.recordCashierLogin(cashierId);
        if (response.success) {
          const updatedCashier = transformApiCashier(response.data);
          setCashiers(prev =>
            prev.map(cashier =>
              cashier.id === cashierId ? updatedCashier : cashier
            )
          );
          toast.success('Login recorded successfully');
        } else {
          console.error('Failed to record login:', response.message);
          toast.error('Failed to record login');
        }
      
    } catch (error) {
      console.error('Error recording login:', error);
      toast.error('Failed to record login');
    }
  };

  const handleExportCashiers = () => {
    // Implement export functionality
    console.log('Export cashiers');
    toast.info('Export functionality coming soon');
  };

  const handleScheduleManagement = () => {
    // Implement schedule management
    console.log('Manage schedules');
    toast.info('Schedule management coming soon');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCashier(null);
  };

  const handleRefresh = () => {
    fetchCashiers();
    // fetchStats();
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
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
      {stats && <CashiersStats stats={stats} />}

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
            onRecordLogin={handleRecordLogin}
            onDelete={handleDeleteCashier}
            isLoading={isRefreshing}
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