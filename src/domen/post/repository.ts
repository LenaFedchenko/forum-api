import type { Post } from "./entity.js";

export interface PostRepository{
    getAll(take?: number, category?: string): Post[]
    getById(id?: number): Post | undefined
    addPost(post: Post, fail: boolean): Promise<Post>
}