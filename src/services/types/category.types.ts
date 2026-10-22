import type { Category } from "../../domain/category/entity";

export interface CategoryServices {
    getAll(): Promise<Category[]>;
    getById(id: number): Promise<Category>;
    addCategory(category: Omit<Category, "id">): Promise<Category>;
}