import express from 'express'

import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'

import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category.js'

import { db } from './prisma/db.js'
import { createCategoryHandlers } from './transport/handlers/category.js'
import { createCategoryRouter } from './transport/routers/category.js'

const app = express()

app.use(express.json())

async function start() {
    const postRepository = createPostRepository()
    const categoryRepository = createCategoryRepository(db)

    const postServices = await createPostService(
        postRepository,
        categoryRepository
    )

    const categoryServices = await createCategoryService(
        categoryRepository
    )

    const postHandlers = createPostHandlers(postServices)
    const categoryHandlers = createCategoryHandlers(categoryServices)

    const postRouter = createPostRouter(postHandlers)
    const categoryRouter = createCategoryRouter(categoryHandlers)

    app.use('/posts', postRouter)
    app.use('/categories', categoryRouter)

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000')
    })
}

start()