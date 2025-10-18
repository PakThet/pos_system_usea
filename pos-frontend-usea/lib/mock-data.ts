import { Product, Category, Store } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    image: null,
    store_id: "1",
    category_id: "1",
    p_name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with A17 Pro chip",
    sku: "IP15P-256-BLK",
    slug: "iphone-15-pro",
    barcode: "194253775301",
    price: "999.99",
    tax: 8.50,
    quantity: 15,
    discount: 0.00,
    quantity_alert: 5,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    store: {
      id: "1",
      name: "Main Downtown Store",
      location: "123 Main Street, Downtown, City Center",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    },
    category: {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      desc: "Smartphones, laptops, tablets and accessories",
      status: "active",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }
  },
  {
    id: "2",
    image: null,
    store_id: "1",
    category_id: "1",
    p_name: "MacBook Air M2",
    description: "Apple laptop with M2 chip",
    sku: "MBA-M2-256-SLV",
    slug: "macbook-air-m2",
    barcode: "194253775302",
    price: "1199.99",
    tax: 8.50,
    quantity: 8,
    discount: 50.00,
    quantity_alert: 3,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    store: {
      id: "1",
      name: "Main Downtown Store",
      location: "123 Main Street, Downtown, City Center",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    },
    category: {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      desc: "Smartphones, laptops, tablets and accessories",
      status: "active",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }
  }
];

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    desc: "Smartphones, laptops, tablets and accessories",
    status: "active",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    desc: "Men's and women's clothing",
    status: "active",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }
];

export const mockStores: Store[] = [
  {
    id: "1",
    name: "Main Downtown Store",
    location: "123 Main Street, Downtown, City Center",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  },
  {
    id: "2",
    name: "Westside Mall Store",
    location: "456 West Avenue, Westside Mall",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }
];