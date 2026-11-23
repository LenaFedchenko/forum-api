import type { Config } from "../config.js";
import { createPasswordHasher } from "../lib/password.js";
import { createTokenService } from "../lib/tokens.js";
import type { Database } from "../prisma/db.js";
import { createRefreshSessionRepository } from "../repositories/refresh-session.js";
import { createUserRepository } from "../repositories/user.js";
import { createAuthService } from "../services/auth/auth.js";
import { createAuthHandlers } from "../transport/handlers/auth.js";
import { createRequireAuth } from "../transport/middlewares/require-auth.js";
import { createAuthRouter } from "../transport/routers/auth.js";

// возвращает и router, и requireAuth — он нужен модулю постов
export function createAuthModule(db: Database, config: Config) {
	const tokens = createTokenService(config.jwt);
	const service = createAuthService({
		users: createUserRepository(db),
		sessions: createRefreshSessionRepository(db),
		passwords: createPasswordHasher(config.passwordPepper),
		tokens,
		refreshTtlMs: config.jwt.refreshTtlMs,
	});
	const requireAuth = createRequireAuth(tokens);
	const router = createAuthRouter(createAuthHandlers(service), requireAuth);
	return { router, requireAuth };
}
