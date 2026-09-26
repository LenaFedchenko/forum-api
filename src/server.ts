import express from 'express'
import * as routerPost from './transport/routers/post.js'

const app = express()
app.use(express.json())
app.use('/posts', routerPost.default)


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
