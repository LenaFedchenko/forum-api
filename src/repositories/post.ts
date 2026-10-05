import type { PostRepository } from "../domen/post/repository.js"
import { db } from "../prisma/db.js"


export function createPostRepository() :PostRepository {
    return{
        async getAll(take, category) {
            if (category && take) {
                return await db.orm.public.Post.where({ category }).limit(take).all();
            }

            if (category) {
                return await db.orm.public.Post.where({ category }).all();
            }

            if (take) {
                return await db.orm.public.Post.limit(take).all();
            }

            return await db.orm.public.Post.all();
        },

        async getById(id){
            return await db.orm.public.Post.where({ id: id }).first()
        },
    
        async addPost(post){
            return await db.orm.public.Post.create(post)
        }
    }
}

