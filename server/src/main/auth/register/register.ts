import { Request, Response, NextFunction } from 'express';
import * as bcrypt from "bcryptjs";
import { HttpStatus } from '../../../common/response/response.type'
import { getRepository } from "typeorm";
import { Users } from '../../../entity/User';
import { transporter } from '../mail/mail'

export const register = async (req:Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(Users)
    const { name, email, password } = req.body

    // 確認密碼格式
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    let isPasswordValid = false
    let passwordErrMsg = "password's format is incorrect"
    if(passwordRules.test(password)){
        isPasswordValid = true
        passwordErrMsg = ""
    }

    // 確認信箱未被使用
    let isEmailExisted = true
    let emailErrMsg = 'email has been registered'
    const user = await userRepository.findOne( { where: { email: email } } );
    
    if(user === undefined){
        isEmailExisted = false
        emailErrMsg = ""
    }

    // 決定回傳內容
    if(isPasswordValid && !isEmailExisted){
        res.status(HttpStatus.OK)
          .json( { status: HttpStatus.OK, 
                   data: { message: 'please verify email', verified: false } } )
        next()
    }
    else
        res.status(HttpStatus.UNAUTHORIZED).json( { status: HttpStatus.UNAUTHORIZED,
        errors: { email: emailErrMsg, password: passwordErrMsg } } )
}

export const saveAndSend = async (req:Request, res: Response) => {
    const { name, email, password } = req.body
    const verifiedCode = '12345'
    const userRepository = getRepository(Users)
    // hash 加密
    const hash =  bcrypt.hashSync(password);

    // 儲存使用者資訊
    const user = {
        name: name,
        email: email,
        password: hash,
        verifiedCode: verifiedCode
    }

    await userRepository.save(user); 

    // 寄出驗證信
    await transporter.sendMail({
        from: '"Malik" smtp.ethereal.email', // sender address
        to: email, // list of receivers
        subject: "Email Verification", // Subject line
        text: `"Your verifiedCode is: ${verifiedCode} "`, // plain text body
    });
}
