import type { PostWithRelations } from "../../domain/post/entity.js";
import type { PostFilter } from "../../domain/post/repository.js";

export interface CreatePostInput {
	title: string;
	content: string | null;
	categoryId: number;
	userId: number;
}

export interface PostService {
	getAll(filter?: PostFilter): Promise<PostWithRelations[]>;
	getById(id: number): Promise<PostWithRelations | null>;
	addPost(input: CreatePostInput): Promise<PostWithRelations>;
	getPostsByAuthorId(userId: number): Promise<PostWithRelations[]>;
}
