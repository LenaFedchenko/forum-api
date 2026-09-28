import express from 'express'

import { createPostRepository } from './repositories/post.js'
import { createPostService } from './services/post.js'
import { createPostHandlers } from './transport/handlers/post.js'
import { createPostRouter } from './transport/routers/post.js'

const app = express()

app.use(express.json())

async function start() {
    const postRepository = createPostRepository()

    const postServices = await createPostService(postRepository)

    const postHandlers = await createPostHandlers(postServices)

    const postRouter = createPostRouter(postHandlers)

    app.use('/posts', postRouter)

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000')
    })
}

start()