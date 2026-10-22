import type { CategoryRepository } from "../domain/category/repository";
import type { CategoryServices } from "./types/category.types";

export function createCategoryService(categoryRepository: CategoryRepository): CategoryServices {
    return{
        async getAll() {
            const categories = await categoryRepository.getAll();
            return categories;
        },
        
        async getById(id) {
            const category = await categoryRepository.getById(id);

            if (!category) {
                throw new Error("CATEGORY_NOT_FOUND");
            }

            return category;
        },
        
        async addCategory(category) {
            return await categoryRepository.addCategory(category);
        }
    }
}