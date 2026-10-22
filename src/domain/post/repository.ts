import type { Post } from "./entity.js";

export interface PostRepository {
    getAll(take?: number, category?: string): Promise<Post[]>;
    getById(id: number): Promise<Post | null>;
    addPost(post: Omit<Post, "id">): Promise<Post>
}