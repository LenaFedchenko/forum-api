import type { Category } from "../../domain/category/entity.js";
import type { NewCategory } from "../../domain/category/repository.js";

export type CreateCategoryInput = NewCategory;

export interface CategoryService {
	getAll(): Promise<Category[]>;
	getById(id: number): Promise<Category>;
	addCategory(input: CreateCategoryInput): Promise<Category>;
}
