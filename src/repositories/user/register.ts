import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../prisma/contract";
import type { UserRepository } from "../../domain/user/repository";

export function createUserRepository(db: PostgresClient<Contract>): UserRepository{
    return{
        async createUser(user){
            return await db.orm.public.User.create(user)
        }
    }
}