"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cashier, CreateCashierData } from "@/types/cashier";
import { storeApi } from "@/services/storeApi";
import { Store } from "@/types/product";

interface CashierFormProps {
  cashier?: Cashier;
  onSubmit: (data: CreateCashierData & { store_id: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultPermissions = [
  "process_sales",
  "handle_returns",
  "view_reports",
  "manage_discounts",
];

type CashierFormData = CreateCashierData & { store_id: string };

export function CashierForm({
  cashier,
  onSubmit,
  onCancel,
  isLoading = false,
}: CashierFormProps) {
  const [formData, setFormData] = useState<CashierFormData>({
    store_id: "",
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "active",
    role: "cashier",
    shift: "morning",
    hourly_rate: 15,
    permissions: defaultPermissions,
  });

  const [stores, setStores] = useState<Store[]>([]);

  // Load stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeApi.getStores();
        if (res.success && res.data) {
          setStores(res.data);
          if (!formData.store_id && res.data.length > 0) {
            setFormData((prev) => ({ ...prev, store_id: res.data[0].id.toString() }));
          }
        }
      } catch (e) {
        console.error("Error fetching stores:", e);
      }
    };
    fetchStores();
  }, []);

  // Load cashier data when editing
  useEffect(() => {
    if (cashier) {
      let parsedPermissions: string[] = [];

      if (typeof cashier.permissions === "string") {
        try {
          parsedPermissions = JSON.parse(cashier.permissions);
        } catch {
          parsedPermissions = defaultPermissions;
        }
      } else if (Array.isArray(cashier.permissions)) {
        parsedPermissions = cashier.permissions;
      } else {
        parsedPermissions = defaultPermissions;
      }

      setFormData({
        store_id: cashier.store_id?.toString() ?? "",
        employee_id: cashier.employee_id || "",
        first_name: cashier.first_name || "",
        last_name: cashier.last_name || "",
        email: cashier.email || "",
        phone: cashier.phone || "",
        status: cashier.status || "active",
        role: cashier.role || "cashier",
        shift: cashier.shift || "morning",
        hourly_rate: cashier.hourly_rate || 15,
        permissions: parsedPermissions,
      });
    }
  }, [cashier]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hourly_rate: Number(formData.hourly_rate),
    });
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permission: string, checked: boolean) => {
 setFormData((prev) => ({
  ...prev,
  permissions: checked
    ? [...(prev.permissions ?? []), permission]
    : (prev.permissions ?? []).filter((p) => p !== permission),
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
      {/* Store */}
      <div className="space-y-2">
        <Label htmlFor="store_id">Store</Label>
        <Select
          value={formData.store_id}
          onValueChange={(value) => setFormData({ ...formData, store_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id.toString()}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee ID */}
      <div className="space-y-2">
        <Label htmlFor="employee_id">Employee ID</Label>
        <Input
          id="employee_id"
          value={formData.employee_id}
          onChange={(e) =>
            setFormData({ ...formData, employee_id: e.target.value })
          }
          placeholder="Enter employee ID"
          required
        />
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      {/* Email & Phone */}
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
        />
      </div>

      {/* Status, Role, Shift */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "active" | "inactive" | "on-break") =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-break">On Break</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value: "cashier" | "senior-cashier" | "head-cashier") =>
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
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
            onValueChange={(value: "morning" | "afternoon" | "evening" | "night") =>
              setFormData({ ...formData, shift: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM–2PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (2PM–10PM)</SelectItem>
              <SelectItem value="evening">Evening (4PM–12AM)</SelectItem>
              <SelectItem value="night">Night (10PM–6AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hourly Rate */}
      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
        <Input
          id="hourlyRate"
          type="number"
          min="0"
          step="0.01"
          value={formData.hourly_rate}
          onChange={(e) =>
            setFormData({ ...formData, hourly_rate: Number(e.target.value) })
          }
          placeholder="Enter hourly rate"
          required
        />
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <Label className="text-base">Permissions</Label>
        <div className="grid grid-cols-2 gap-4">
          {permissionOptions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={permission.id}
                checked={formData.permissions?.includes(permission.id) ?? false}
                onChange={(e) =>
                  handlePermissionChange(permission.id, e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label
                htmlFor={permission.id}
                className="text-sm font-normal cursor-pointer"
              >
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
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
