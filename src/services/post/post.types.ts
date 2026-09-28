import type { Post } from "../../domen/post/entity.js"

export interface PostServices{
    getAll(take?: number, category?: string): Post[]
    getById(id?: number): Post | undefined
    addPost(post: Post, fail: boolean): Promise<Post>
}