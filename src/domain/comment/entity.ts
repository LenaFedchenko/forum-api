import { User } from "../user/entity.js";

export interface Comment {
	id: number;
	content: string;
	postId: number;
	authorId: number;
	createdAt: Temporal.Instant;
}
export interface CommentWithUser extends Comment {
	user: User; 
}