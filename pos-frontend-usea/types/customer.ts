export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  status: "active" | "inactive";
  tier: "standard" | "premium" | "vip";
  total_orders: number;
  total_spent: number;
  last_order?: string;
  notes?: string | null;
  address?: CustomerAddress;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status?: "active" | "inactive";
  tier?: "standard" | "premium" | "vip";
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  new_this_month: number;
  premium: number;
  vip: number;
  average_order_value: number;
  tierDistribution: {
    standard: number;
    premium: number;
    vip: number;
  };
}
