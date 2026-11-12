import type { Category } from "../category/entity";
import type { User } from "../user/entity";

export interface Post {
    id: number;
    title: string;
    content: string | null;
    category: Category | null;
    categoryId: number | null;
    user: User;
    userId: number;
}