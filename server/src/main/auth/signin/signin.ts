import { Request, Response } from 'express';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { HttpStatus } from '../../../common/response/response.type'
import { getRepository } from "typeorm";
import { Users } from '../../../entity/User';

export const signin = async (req:Request,res:Response) => {
    const userRepository = getRepository(Users)
    const { email, password } = req.body
    const user = await userRepository.findOne( { select:['email','password'], where: { email: email } } );
    
    // 驗證 email 是否存在
    let isEmailExisted = true
    let emailErrMsg = ''   
    if(user === undefined){
        isEmailExisted = false
        emailErrMsg = "email doesn't exist"
    }

    // 從 email 找出對應 password 並驗證 password 是否正確
    let isPasswordCorrect = true
    let passwordErrMsg = ''
    if(isEmailExisted){
        if(!bcrypt.compareSync(password,user.password)){
            isPasswordCorrect = false
            passwordErrMsg = 'password is incorrect'
        }
    }

    if(isPasswordCorrect && isEmailExisted){
        // 產生 JWT
        const payload = {
            id: user.id,
            name: user.name,
            mail: user.email
        };
        const token = jwt.sign(
            payload,
            '@QEGTUI', // can change to any string
            { expiresIn: "1h" }
        );
        
        res.status(HttpStatus.OK).json( { status: HttpStatus.OK, data: { token: token } } )

    }else{
        res.status(HttpStatus.UNAUTHORIZED)
            .json( { status: HttpStatus.UNAUTHORIZED,
                     errors: { email: emailErrMsg, password: passwordErrMsg } } )
    }
}