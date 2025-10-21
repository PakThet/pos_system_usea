
import { Category } from "@/types/category";
import { CategoryCard } from "./category-card";

interface CategoriesGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesGrid({ categories, onEdit, onDelete }: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          No categories found. Create your first category to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, idx) => (
  <CategoryCard
    key={category.id ?? `temp-id-${idx}`}  
    category={category}
    onEdit={onEdit}
    onDelete={onDelete}
  />
))}

    </div>
  );
}