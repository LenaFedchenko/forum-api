import type { NewUser, User } from "./entity";

export interface UserRepository{
    createUser(user: NewUser): Promise<User>
}