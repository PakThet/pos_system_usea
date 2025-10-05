export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  tier: 'standard' | 'premium' | 'vip';
  totalOrders: number;
  totalSpent: number;
  lastOrder?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  premium: number;
  vip: number;
  averageOrderValue: number;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tier: 'standard' | 'premium' | 'vip';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export type CustomerTier = Customer['tier'];
export type CustomerStatus = Customer['status'];