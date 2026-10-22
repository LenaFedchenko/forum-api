import type { Category } from "./entity";

export interface CategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: number): Promise<Category | null>;
    addCategory(category: Omit<Category, "id">): Promise<Category>;
}