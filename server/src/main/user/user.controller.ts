import { Request, Response } from 'express';
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import * as userRepository from "../../repositories/user.repository";
import { ResponseUserDTO } from "../../dtos/user.dto";
import { ResponseObject } from "../../common/response/response.object";
import { JwtPayload } from '../../dtos/auth.dto';

export const getUser = async function (req: Request, res: Response): Promise<ResponseObject<ResponseUserDTO>> {
    const payload: JwtPayload = res.locals.payload;
    const user = await userRepository.getUser(payload.id);
    if (!user) {
        const e = new Error('User missing');
        (e as any).status = HttpStatus.INTERNAL_ERROR;
        throw e;
    }
    const dto = new ResponseUserDTO(user);
    return formatResponse(dto, HttpStatus.OK);
};