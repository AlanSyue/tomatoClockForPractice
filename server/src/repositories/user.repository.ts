import { Repository, getRepository } from "typeorm";
import { User } from "../entity/User";

export const getUser = async function (id: number): Promise<User | null> {
    const repository: Repository<User> = getRepository(User);
    const user = await repository.findOne(id);
    return user || null;
};

export const getUserByEmail = async function (email: string): Promise<User | null> {
    const repository: Repository<User> = getRepository(User);
    const user = await repository.findOne({ email });
    return user || null;
};

interface IAddUser {
    name: string
    email: string
    salt: string
    hash: string
    emailVerifiedCode: string
}

export const addUser = async function (params: IAddUser): Promise<User> {
    const repository: Repository<User> = getRepository(User);
    const { name, email, salt, hash, emailVerifiedCode } = params;
    const data = { name, email, salt, hash, emailVerifiedCode };
    const user = await repository.create(data);
    return await repository.save(user);
};

interface IUpdateUser {
    id: number,
    name?: string,
    email?: string,
    salf?: string,
    hash?: string,
    emailVerifiedStatus?: boolean,
    emailVerifiedCode?: string,
}

export const updateUser = async function (params: IUpdateUser): Promise<User | null> {
    const repository: Repository<User> = getRepository(User);
    const {
        id,
        name,
        email,
        salf,
        hash,
        emailVerifiedStatus,
        emailVerifiedCode
    } = params;

    const updatedData: any = { name, email, salf, hash, emailVerifiedStatus, emailVerifiedCode };
    const noNullUpdatedData: any = Object.keys(updatedData).reduce((result: any, k) => {
        const v = updatedData[k];
        if (v !== undefined) {
            result[k] = v;
        }
        return result;
    }, {})
    const user = await repository.findOne(id);
    if (!user) {
        return null;
    }
    repository.merge(user, noNullUpdatedData);
    return await repository.save(user);
};