import type { Post } from "../../domain/post/entity.js"

export interface PostServices{
    getAll(take?: number, category?: string): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(post: Omit<Post, "id">): Promise<Post>
}