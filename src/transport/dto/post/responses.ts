import type { UserResponse } from "../auth/responses.js";
import type { CategoryResponse } from "../category/responses.js";

export interface PostResponse {
	id: number;
	title: string;
	content: string | null;
	categoryId: number | null;
	userId: number;
	category: CategoryResponse | null;
	user: UserResponse | null;
}
