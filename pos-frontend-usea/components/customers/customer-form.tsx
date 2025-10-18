"use client";

import { useState } from "react";
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
import {
  Customer,
  CreateCustomerData,
  CustomerAddress,
} from "@/types/customer";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isLoading = false,
}: CustomerFormProps) {
  // Ensure we handle customers that may not have an address
  const firstAddress: CustomerAddress =
    (Array.isArray(customer?.address)
      ? customer?.address[0]
      : (customer as any)?.address?.[0]) || {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    };

  const [formData, setFormData] = useState({
    firstName: customer?.first_name ?? "",
    lastName: customer?.last_name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    tier: customer?.tier ?? "standard",
    street: firstAddress.street ?? "",
    city: firstAddress.city ?? "",
    state: firstAddress.state ?? "",
    zipCode: firstAddress.zip_code ?? "",
    country: firstAddress.country ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerData: CreateCustomerData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      tier: formData.tier as "standard" | "premium" | "vip",
    };

    // Include address only if at least one field is filled
    if (
      formData.street ||
      formData.city ||
      formData.state ||
      formData.zipCode ||
      formData.country
    ) {
      customerData.address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
      };
    }

    onSubmit(customerData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-background p-6 rounded-2xl border"
    >
      {/* Personal Info Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
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
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          placeholder="Enter phone number"
        />
      </div>

      {/* Tier Selection */}
      <div className="space-y-2">
        <Label htmlFor="tier">Customer Tier</Label>
        <Select
          value={formData.tier}
          onValueChange={(value: "standard" | "premium" | "vip") =>
            setFormData({ ...formData, tier: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Address Section */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-semibold">Address (Optional)</Label>

        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            placeholder="Enter street address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              placeholder="Enter ZIP code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : customer ? "Update" : "Create"} Customer
        </Button>
      </div>
    </form>
  );
}
