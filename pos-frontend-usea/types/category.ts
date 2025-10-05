export interface Category {
  id: string;
  name: string;
  slug: string;
  desc?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  desc?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  status?: 'active' | 'inactive';
}