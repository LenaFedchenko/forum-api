import type { RegisterUser, PublicUser } from "../../domain/user/entity";

export interface UserService {
    register(user: RegisterUser): Promise<PublicUser>;
}