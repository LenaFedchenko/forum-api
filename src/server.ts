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
import { createUserRepository } from './repositories/user/register.js'
import { createRegister } from './services/user.js'
import { createUserHandler } from './transport/handlers/user.js'
import { createUserRouter } from './transport/routers/user.js'
import cors from 'cors'
import { signAccessToken } from './lib/tocken.js'

const app = express()

app.use(cors())
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
    const userRepository = createUserRepository(db);
    const userService = createRegister(userRepository, {signAccessToken});
    const userHandler = createUserHandler(userService);
    const userRouter = createUserRouter(userHandler);

    app.use("/users", userRouter);

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000')
    })
}

start()