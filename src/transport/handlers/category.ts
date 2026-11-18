import type { Request, Response } from "express";
import type { CategoryServices } from "../../services/types/category.types.js";
import { hasErrorCode, isUniqueViolation } from "../errors.js";


export interface CategoryHandler {
    getAll(req: Request, res: Response): Promise<Response | void>;
    getById(req: Request, res: Response): Promise<Response | void>;
    addCategory(req: Request, res: Response): Promise<Response | void>;
}
export function createCategoryHandlers(CategoryServices: CategoryServices): CategoryHandler {
    return {
        async getAll(req: Request, res: Response) {
            try {
                const categories = await CategoryServices.getAll();
                return res.status(200).json(categories);
            } catch (error) {
                console.error("GET CATEGORIES ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        },

        async getById(req: Request, res: Response) {
            const { id } = req.params;
            const intId = Number(id);

            if (!Number.isInteger(intId) || intId <= 0) {
                return res.status(400).json({
                    message: "invalid category id"
                });
            }

            try {
                const category = await CategoryServices.getById(intId);

                return res.status(200).json(category);
            } catch (error) {
                if (hasErrorCode(error, "CATEGORY_NOT_FOUND")) {
                    return res.status(404).json({
                        message: "category not found"
                    });
                }

                console.error("GET CATEGORY ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        },

        async addCategory(req: Request, res: Response) {
            const { name, description } = req.body ?? {};

            if (typeof name !== "string" || !name.trim()) {
                return res.status(422).json({
                    message: "name is required"
                });
            }

            if (description !== undefined && description !== null && typeof description !== "string") {
                return res.status(400).json({
                    message: "description must be a string"
                });
            }

            try {
                const category = await CategoryServices.addCategory({
                    name,
                    description: description ?? null
                });

                return res.status(201).json(category);
            } catch (error) {
                if (isUniqueViolation(error)) {
                    return res.status(400).json({
                        message: "category with this name already exists"
                    });
                }

                console.error("ADD CATEGORY ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        }
    };
}
