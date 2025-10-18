"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cashier, CreateCashierData } from "@/types/cashier";

interface CashierFormProps {
  cashier?: Cashier;
  onSubmit: (data: CreateCashierData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultPermissions = [
  "process_sales",
  "handle_returns",
  "view_reports",
  "manage_discounts"
];

export function CashierForm({
  cashier,
  onSubmit,
  onCancel,
  isLoading = false,
}: CashierFormProps) {
  const [formData, setFormData] = useState({
    firstName: cashier?.firstName || "",
    lastName: cashier?.lastName || "",
    email: cashier?.email || "",
    phone: cashier?.phone || "",
    role: cashier?.role || "cashier",
    shift: cashier?.shift || "morning",
    hourlyRate: cashier?.hourlyRate || 15,
    permissions: cashier?.permissions || defaultPermissions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cashierData: CreateCashierData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as 'cashier' | 'senior-cashier' | 'head-cashier',
      shift: formData.shift as 'morning' | 'afternoon' | 'evening' | 'night',
      hourlyRate: Number(formData.hourlyRate),
      permissions: formData.permissions,
    };

    onSubmit(cashierData);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const permissionOptions = [
    { id: "process_sales", label: "Process Sales" },
    { id: "handle_returns", label: "Handle Returns" },
    { id: "view_reports", label: "View Reports" },
    { id: "manage_discounts", label: "Manage Discounts" },
    { id: "void_transactions", label: "Void Transactions" },
    { id: "manage_inventory", label: "Manage Inventory" },
    { id: "access_cash_drawer", label: "Access Cash Drawer" },
    { id: "manage_users", label: "Manage Users" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value: 'cashier' | 'senior-cashier' | 'head-cashier') =>
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="senior-cashier">Senior Cashier</SelectItem>
              <SelectItem value="head-cashier">Head Cashier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift">Shift</Label>
          <Select
            value={formData.shift}
            onValueChange={(value: 'morning' | 'afternoon' | 'evening' | 'night') =>
              setFormData({ ...formData, shift: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM-2PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (2PM-10PM)</SelectItem>
              <SelectItem value="evening">Evening (4PM-12AM)</SelectItem>
              <SelectItem value="night">Night (10PM-6AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
        <Input
          id="hourlyRate"
          type="number"
          min="0"
          step="0.01"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
          placeholder="Enter hourly rate"
          required
        />
      </div>

      {/* Permissions Section */}
      <div className="space-y-4">
        <Label className="text-base">Permissions</Label>
        <div className="grid grid-cols-2 gap-4">
          {permissionOptions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={permission.id} className="text-sm font-normal">
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : cashier ? "Update" : "Create"} Cashier
        </Button>
      </div>
    </form>
  );
}