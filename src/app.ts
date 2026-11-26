import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { ROUTES } from "./constants/routes.js";
import { createAuthModule } from "./modules/auth.js";
import { createCategoryModule } from "./modules/category.js";
import { createPostModule } from "./modules/post.js";
import { createDb } from "./prisma/db.js";
import { createCommentModule } from "./modules/comment.js";

const db = createDb(config.databaseUrl);
const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

const auth = createAuthModule(db, config);
const comments = createCommentModule(db, auth.requireAuth);
app.use(ROUTES.POSTS, createPostModule(db, auth.requireAuth, comments.handlers));
app.use(ROUTES.COMMENTS, comments.router);
app.use(ROUTES.CATEGORIES, createCategoryModule(db));
app.use(ROUTES.AUTH, auth.router);

app.listen(config.port, () => {
	console.log(`Server is running on http://localhost:${config.port}`);
});
