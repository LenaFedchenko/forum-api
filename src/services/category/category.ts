import type { CategoryRepository } from "../../domain/category/repository.js";
import type { CategoryService } from "./category.types.js";

export function createCategoryService(
	categoryRepository: CategoryRepository,
): CategoryService {
	return {
		getAll() {
			return categoryRepository.getAll();
		},

		async getById(id) {
			const category = await categoryRepository.getById(id);
			if (!category) throw new Error("CATEGORY_NOT_FOUND");
			return category;
		},

		addCategory(input) {
			return categoryRepository.create(input);
		},
	};
}
