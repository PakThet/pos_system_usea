// /types/category.ts

export type CategoryStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
  products_count?: number;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  status?: CategoryStatus;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  status?: CategoryStatus;
}
