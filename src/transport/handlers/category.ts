import type { RequestHandler } from "express";
import type { CategoryService } from "../../services/category/category.types.js";
import type { CreateCategoryRequest } from "../dto/category/requests.js";
import type { CategoryResponse } from "../dto/category/responses.js";
import type { ErrorResponse, IdParams, NoParams } from "../dto/common.js";

export interface CategoryHandlers {
	getAll: RequestHandler<NoParams, CategoryResponse[] | ErrorResponse>;
	getById: RequestHandler<IdParams, CategoryResponse | ErrorResponse>;
	addCategory: RequestHandler<
		NoParams,
		CategoryResponse | ErrorResponse,
		CreateCategoryRequest
	>;
}

export function createCategoryHandlers(
	categoryService: CategoryService,
): CategoryHandlers {
	return {
		async getAll(_req, res) {
			try {
				const categories = await categoryService.getAll();
				res.status(200).json(categories);
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async getById(req, res) {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				res.status(400).json({ message: "Invalid category id" });
				return;
			}

			try {
				const category = await categoryService.getById(id);
				res.status(200).json(category);
			} catch (error) {
				if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
					res.status(404).json({ message: "Category not found" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async addCategory(req, res) {
			const { name, description } = req.body ?? {};

			if (typeof name !== "string" || !name.trim()) {
				res.status(422).json({ message: "Invalid category data" });
				return;
			}

			if (
				description !== undefined &&
				description !== null &&
				typeof description !== "string"
			) {
				res.status(422).json({ message: "Invalid category data" });
				return;
			}

			try {
				const category = await categoryService.addCategory({
					name,
					description: description ?? null,
				});
				res.status(201).json(category);
			} catch (error) {
				if (
					error instanceof Error &&
					error.message === "CATEGORY_ALREADY_EXISTS"
				) {
					res.status(409).json({ message: "Category already exists" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
