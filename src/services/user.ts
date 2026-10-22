import type { UserRepository } from "../domain/user/repository";
import { hashPasswordFunc } from "../lib/password";
import type { UserService } from "./types/user.types";

export function createRegister(UserRepository: UserRepository): UserService{
    return{
        async register(user){
            const {email, name, password} = user
            const hashPassword = await hashPasswordFunc(password)
            const newUser = await UserRepository.createUser({email, name, hashPassword})
            return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        }
    }
}