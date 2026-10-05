import type { Post } from "../../domen/post/entity.js"

export interface PostServices{
    getAll(take?: number, category?: string): Promise<Post[]>
    getById(id: number): Promise<Post | null>
    addPost(post: Post): Promise<Post>
}