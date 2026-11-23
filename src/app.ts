import 'dotenv/config'
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
import { createRefreshSessionRepository } from './repositories/refreshSession.js'
import { createRegister } from './services/user.js'
import { createUserHandler } from './transport/handlers/user.js'
import { createUserRouter } from './transport/routers/user.js'

import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashRefreshToken
} from './lib/tocken.js'

import { db } from './prisma/db.js'

// без этих переменных токены и пароли не работают, поэтому падаем сразу на старте
for (const name of ['DATABASE_URL', 'JWT_SECRET', 'PEPPER']) {
    if (!process.env[name]) {
        throw new Error(`${name} is not set`)
    }
}

const PORT = Number(process.env.PORT ?? 3000)
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

const app = express()

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

async function start() {
    const postRepository = createPostRepository()
    const categoryRepository = createCategoryRepository(db)
    const userRepository = createUserRepository(db)
    const refreshSessionRepository = createRefreshSessionRepository(db)

    const postServices = createPostService(
        postRepository,
        categoryRepository,
        userRepository
    )

    const categoryServices = createCategoryService(
        categoryRepository
    )

    const postHandlers = createPostHandlers(postServices)
    const categoryHandlers = createCategoryHandlers(categoryServices)


    const userService = createRegister(
        userRepository,
        {
            signAccessToken,
            signRefreshToken,
            verifyRefreshToken
        },
        { hashToken: hashRefreshToken },
        refreshSessionRepository
    )

    const requireAuth = createRequireAuth(verifyAccessToken)

    const postRouter = createPostRouter(postHandlers, requireAuth)
    const categoryRouter = createCategoryRouter(categoryHandlers)

    const userHandler = createUserHandler(userService)
    const userRouter = createUserRouter(userHandler, requireAuth)

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' })
    })

    app.use('/posts', postRouter)
    app.use('/categories', categoryRouter)
    app.use('/users', userRouter)

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

start()
