import type { NewUser, User } from "./entity";

export interface UserRepository{
    createUser(user: NewUser): Promise<User>
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
}
