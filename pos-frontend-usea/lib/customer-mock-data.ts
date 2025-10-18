import { Customer, CustomerStats } from "@/types/customer";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    tier: "premium",
    totalOrders: 12,
    totalSpent: 2450.75,
    lastOrder: new Date('2024-01-15'),
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2024-01-15'),
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    tier: "vip",
    totalOrders: 28,
    totalSpent: 5890.25,
    lastOrder: new Date('2024-01-14'),
    createdAt: new Date('2022-11-20'),
    updatedAt: new Date('2024-01-14'),
    notes: "Preferred customer, always buys premium products"
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    status: "inactive",
    tier: "standard",
    totalOrders: 3,
    totalSpent: 450.50,
    lastOrder: new Date('2023-12-01'),
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    tier: "premium",
    totalOrders: 15,
    totalSpent: 3200.00,
    lastOrder: new Date('2024-01-12'),
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-12'),
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    }
  }
];

export const mockStats: CustomerStats = {
  total: 1247,
  active: 984,
  inactive: 263,
  newThisMonth: 42,
  premium: 156,
  vip: 28,
  averageOrderValue: 189.50
};