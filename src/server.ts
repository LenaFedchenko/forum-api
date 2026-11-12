import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createRequireAuth } from './middleware/requireAuth.js'

import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'

import { createCategoryRepository } from './repositories/category.js'
import { createCategoryService } from './services/category.js'
import { createCategoryHandlers } from './transport/handlers/category.js'
import { createCategoryRouter } from './transport/routers/category.js'

import { createUserRepository } from './repositories/user/register.js'
import { createRegister } from './services/user.js'
import { createUserHandler } from './transport/handlers/user.js'
import { createUserRouter } from './transport/routers/user.js'

import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from './lib/tocken.js'

import { db } from './prisma/db.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

async function start() {
    const postRepository = createPostRepository()
    const categoryRepository = createCategoryRepository(db)
    const userRepository = createUserRepository(db)

    const postServices = await createPostService(
        postRepository,
        categoryRepository,
        userRepository
    )

    const categoryServices = await createCategoryService(
        categoryRepository
    )

    const postHandlers = createPostHandlers(postServices)
    const categoryHandlers = createCategoryHandlers(categoryServices)


    const userService = createRegister(userRepository, {
        signAccessToken,
        signRefreshToken,
        verifyRefreshToken
    })

    const requireAuth = createRequireAuth(verifyAccessToken)

    const postRouter = createPostRouter(postHandlers, requireAuth)
    const categoryRouter = createCategoryRouter(categoryHandlers)

    const userHandler = createUserHandler(userService)
    const userRouter = createUserRouter(userHandler, requireAuth)

    app.use('/posts', postRouter)
    app.use('/categories', categoryRouter)
    app.use('/users', userRouter)

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000')
    })
}

start()
