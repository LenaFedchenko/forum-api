import type { Request, Response } from "express";
import type { CategoryServices } from "../../services/types/category.types.js";


export interface CategoryHandler {
    getAll(req: Request, res: Response): Promise<Response | void>;
    getById(req: Request, res: Response): Promise<Response | void>;
    addCategory(req: Request, res: Response): Promise<Response | void>;
}
export function createCategoryHandlers(CategoryServices: CategoryServices) {
    return {
        async getAll(req: Request, res: Response) {
            const categories = await CategoryServices.getAll();
            return res.status(200).json(categories);
        },

        async getById(req: Request, res: Response) {
            const { id } = req.params;
            const intId = Number(id);

            if (!Number.isInteger(intId) || intId <= 0) {
                return res.status(400).json({
                    message: "invalid category id"
                });
            }

            const category = await CategoryServices.getById(intId);

            return res.status(200).json(category);
        },

        async addCategory(req: Request, res: Response) {
            const { name, description } = req.body;

            if (!name) {
                return res.status(422).json({
                    message: "name is required"
                });
            }

            const category = await CategoryServices.addCategory({
                name,
                description: description ?? null
            });

            return res.status(201).json(category);
        }
    };
}