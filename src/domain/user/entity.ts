export interface User {
    id: number;
    email: string;
    name: string;
    hashPassword: string;
}

export type NewUser = Omit<User, "id">;

export type RegisterUser = {
    email: string;
    name: string;
    password: string;
};

export type PublicUser = Omit<User, "hashPassword">;