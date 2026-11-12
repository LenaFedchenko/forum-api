import type { RequestHandler } from "express"

export function createRequireAuth(verifyAccessToken: (token: string) => number):RequestHandler {
    return (req, res, next) => {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        try{
            const userId = verifyAccessToken(accessToken)
            res.locals.userId = userId
        }catch (error) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        next()
    }
}