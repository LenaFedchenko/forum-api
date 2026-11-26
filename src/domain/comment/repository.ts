import type { Comment, CommentWithUser } from "./entity.js";

export type NewComment = Omit<Comment, "id" | "createdAt">;

export interface CommentRepository {
		getByPostId(postId: number): Promise<CommentWithUser[]>;
		create(data: NewComment): Promise<Comment>;
		delete(commentId: number): Promise<void>;
		getById(commentId: number): Promise<Comment | null>;
	}