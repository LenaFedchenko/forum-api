import type { Category } from "../../../domain/category/entity";

export interface PostResponse {
    id: number;
    title: string;
    content: string | null;
    category: Category | null;
    userId: number | null;
}