"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Plus, 
  Users,
  Clock,
  RefreshCw
} from "lucide-react";
import { Employee, EmployeeStats, CreateEmployeeData } from "@/types/employee";
import { toast } from "sonner";
import { employeeApi } from "@/services/employeeApi";
import { EmployeesStats } from "@/components/employees/employees-stats";
import { EmployeesTable } from "@/components/employees/employees-table";
import { EmployeeDetailsDialog } from "@/components/employees/employee-details-dialog";
import { EmployeeForm } from "@/components/employees/employee-form";

// Transform API employee to app employee format
const transformApiEmployee = (apiEmployee: any): Employee => ({
  id: apiEmployee.id.toString(),
  employee_id: apiEmployee.employee_id,
  first_name: apiEmployee.first_name,
  last_name: apiEmployee.last_name,
  email: apiEmployee.email,
  phone: apiEmployee.phone || undefined,
  avatar: apiEmployee.avatar || undefined,
  status: apiEmployee.status,
  role: apiEmployee.role,
  shift: apiEmployee.shift,
  hourly_rate: parseFloat(apiEmployee.hourly_rate),
  total_hours: apiEmployee.total_hours || 0,
  total_sales: parseFloat(apiEmployee.total_sales) || 0,
  total_transactions: apiEmployee.total_transactions || 0,
  permissions: Array.isArray(apiEmployee.permissions) 
    ? apiEmployee.permissions 
    : (apiEmployee.permissions ? JSON.parse(apiEmployee.permissions) : []),
  last_login_at: apiEmployee.last_login_at ? new Date(apiEmployee.last_login_at) : undefined,
  created_at: new Date(apiEmployee.created_at),
  updated_at: new Date(apiEmployee.updated_at),
});

// Calculate stats from employees data
const calculateStats = (employees: Employee[]): EmployeeStats => {
  const total = employees.length;
  const active = employees.filter(e => e.status === 'active').length;
  const onBreak = employees.filter(e => e.status === 'on-break').length;
  const totalSales = employees.reduce((sum, e) => sum + e.total_sales, 0);
  const totalTransactions = employees.reduce((sum, e) => sum + e.total_transactions, 0);
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return {
    total,
    active,
    onBreak,
    totalSales,
    totalTransactions,
    averageTransaction: parseFloat(averageTransaction.toFixed(2))
  };
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch employees and calculate stats on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Update stats when employees change
  useEffect(() => {
    if (employees.length > 0) {
      setStats(calculateStats(employees));
    }
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      setIsRefreshing(true);
      const response = await employeeApi.getEmployees();
      if (response.success) {
        const transformedEmployees = response.data.data.map(transformApiEmployee);
        setEmployees(transformedEmployees);
      } else {
        console.error('Failed to fetch employees:', response.message);
        toast.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleStatusChange = async (employeeId: string, status: Employee['status']) => {
    try {
      const response = await employeeApi.updateEmployeeStatus(employeeId, status);
      if (response.success) {
        const updatedEmployee = transformApiEmployee(response.data);
        setEmployees(prev =>
          prev.map(employee =>
            employee.id === employeeId ? updatedEmployee : employee
          )
        );
        toast.success('Employee status updated successfully');
      } else {
        console.error('Failed to update employee status:', response.message);
        toast.error('Failed to update employee status');
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast.error('Failed to update employee status');
    }
  };

  const handleCreateEmployee = async (data: CreateEmployeeData & { store_id: string }) => {
    setIsLoading(true);
    try {
      const response = await employeeApi.createEmployee(data);
      if (response.success) {
        const newEmployee = transformApiEmployee(response.data);
        setEmployees(prev => [...prev, newEmployee]);
        setShowForm(false);
        toast.success('Employee created successfully');
      } else {
        console.error('Failed to create employee:', response.message);
        toast.error('Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (data: CreateEmployeeData & { store_id: string }) => {
    if (!editingEmployee) return;
    
    setIsLoading(true);
    try {
      const response = await employeeApi.updateEmployee(editingEmployee.id, data);
      if (response.success) {
        const updatedEmployee = transformApiEmployee(response.data);
        setEmployees(prev =>
          prev.map(employee =>
            employee.id === editingEmployee.id ? updatedEmployee : employee
          )
        );
        setEditingEmployee(null);
        setShowForm(false);
        toast.success('Employee updated successfully');
      } else {
        console.error('Failed to update employee:', response.message);
        toast.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await employeeApi.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handleRecordLogin = async (employeeId: string) => {
    try {
      const response = await employeeApi.recordEmployeeLogin(employeeId);
      if (response.success) {
        const updatedEmployee = transformApiEmployee(response.data);
        setEmployees(prev =>
          prev.map(employee =>
            employee.id === employeeId ? updatedEmployee : employee
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

  const handleExportEmployees = () => {
    toast.info('Export functionality coming soon');
  };

  const handleScheduleManagement = () => {
    toast.info('Schedule management coming soon');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleRefresh = () => {
    fetchEmployees();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Employees
          </h1>
          <p className="text-muted-foreground">
            Manage your employee team and their schedules
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
          <Button variant="outline" onClick={handleExportEmployees}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && <EmployeesStats stats={stats} />}

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesTable
            employees={employees}
            onView={handleViewEmployee}
            onEdit={handleEditEmployee}
            onStatusChange={handleStatusChange}
            onRecordLogin={handleRecordLogin}
            onDelete={handleDeleteEmployee}
            isLoading={isRefreshing}
          />
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <EmployeeDetailsDialog
        employee={selectedEmployee}
        open={showDetails}
        onOpenChange={setShowDetails}
        onEdit={handleEditEmployee}
      />

      {/* Employee Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              employee={editingEmployee || undefined}
              onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}