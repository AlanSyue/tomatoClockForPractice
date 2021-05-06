import { Request } from 'express';
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import * as userRepository from "../../repositories/user.repository";
import { ResponseSignInDTO } from "../../dtos/auth.dto";
import { ResponseObject } from "../../common/response/response.object";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async function (req: Request): Promise<ResponseObject<string>> {
    const {
        name,
        email,
        password
    } = req.body;

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw Error('email has been registered');
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
    const hash = await bcrypt.hash(password, salt);
    const emailVerifiedCode = ("000000" + String(Math.floor(Math.random() * 999999))).slice(-6);
    await userRepository.addUser({
        name,
        email,
        hash,
        salt,
        emailVerifiedCode
    });

    return formatResponse('ok', HttpStatus.OK);
};

export const signin = async function (req: Request): Promise<ResponseObject<ResponseSignInDTO>> {
    const {
        email,
        password
    } = req.body;

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        const e = new Error(`email doesn't exist`);
        (e as any).status = HttpStatus.BAD_REQUEST;
        throw e;
    }

    const isPassed = await bcrypt.compare(password, user.hash);
    if (!isPassed) {
        const e = new Error('password incorrect');
        (e as any).status = HttpStatus.BAD_REQUEST;
        throw e;
    }

    const payload = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    const token = jwt.sign(payload, String(process.env.JWT_SECRET), { expiresIn: '1h' })
    const dto = new ResponseSignInDTO({ token });
    return formatResponse(dto, HttpStatus.OK);
};


export const verify = async function (req: Request): Promise<ResponseObject<string>> {
    const {
        id,
        verifiedCode
    } = req.body;

    const user = await userRepository.getUser(id);
    if (!user) {
        const e = new Error(`id doesn't exist`);
        (e as any).status = HttpStatus.BAD_REQUEST;
        throw e;
    }

    if(user.emailVerifiedCode !== verifiedCode){
        const e = new Error(`invalid code`);
        (e as any).status = HttpStatus.BAD_REQUEST;
        throw e;
    }

    await userRepository.updateUser({
        id,
        emailVerifiedStatus: true
    });

    return formatResponse('ok', HttpStatus.OK);
};