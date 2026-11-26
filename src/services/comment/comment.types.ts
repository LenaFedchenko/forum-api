import type { Comment } from "../../domain/comment/entity.js";

export type CreateCommentInput= {
  postId: number;
  authorId: number;
  content: string;
}

export interface CommentService {
  getByPostId(postId: number): Promise<Comment[]>;
  create(input: CreateCommentInput): Promise<Comment>;
  delete(commentId: number, userId: number): Promise<void>;
}