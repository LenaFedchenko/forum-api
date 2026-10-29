import type { RegisterUser, PublicUser } from "../../domain/user/entity";

export type LoginUser = {
    email: string;
    password: string;
};

export interface UserService {
    register(user: RegisterUser): Promise<PublicUser>;

    login(input: LoginUser): Promise<{
        user: PublicUser;
        accessToken: string;
        refreshToken: string;
    }>;

    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}

export interface TokenService {
    signAccessToken(userId: number): string;
    signRefreshToken(userId: number): string;
    verifyRefreshToken(token: string): number;
}
