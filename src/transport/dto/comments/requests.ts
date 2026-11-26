export interface CreateCommentRequest {
    content: string;
    postId: number;
    authorId: number;
}