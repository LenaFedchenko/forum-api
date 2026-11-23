import type { Post, PostWithRelations } from "./entity.js";

export type NewPost = Omit<Post, "id">;

export interface PostFilter {
	take?: number | undefined;
	// имя категории
	category?: string | undefined;
}

export interface PostRepository {
	getAll(filter?: PostFilter): Promise<PostWithRelations[]>;
	getById(id: number): Promise<PostWithRelations | null>;
	create(data: NewPost): Promise<PostWithRelations>;
	getPostsByAuthorId(userId: number): Promise<PostWithRelations[]>;
}
