import { Request, Response } from 'express';
import { HttpStatus } from '../../../common/response/response.type'
import { getRepository } from "typeorm";
import { Users } from '../../../entity/User';

export const verify = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users)
    const { id, verifiedCode} = req.query
    
    // 驗證 verifiedCode 是否正確
    let verifiedMsg = 'link incorrect'
    const user = await userRepository.findOne( { select:['verifiedCode'], where: { id: id } } );
    
    if(user !== undefined) // id 存在
    {  
        if(verifiedCode === user.verifiedCode)  // 驗證碼正確
        { 
            verifiedMsg = 'signup success'
            let user = await userRepository.findOne( { where: { id: id } } )
            user.verified = true
            user.verifiedAt = new Date().toISOString()
            await userRepository.save(user); 
            res.status(HttpStatus.OK).json( { status: HttpStatus.OK, message: verifiedMsg } )
        }
    }
    else // id 不存在 or 驗證碼錯誤
        res.status(HttpStatus.UNAUTHORIZED).json( { status: HttpStatus.UNAUTHORIZED, message: verifiedMsg } )
    
}