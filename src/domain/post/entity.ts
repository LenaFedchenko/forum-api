import type { Category } from "../category/entity.js";
import type { PublicUser } from "../user/entity.js";

export interface Post {
	id: number;
	title: string;
	content: string | null;
	categoryId: number | null;
	userId: number;
}

// пост вместе с категорией и автором — автор без hashPassword.
// user в БД обязателен, но Prisma при include с select типизирует связь как nullable
export interface PostWithRelations extends Post {
	category: Category | null;
	user: PublicUser | null;
}
