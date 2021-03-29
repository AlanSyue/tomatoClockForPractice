import { Request, Response } from 'express';
import { HttpStatus } from '../../common/response/response.type'
import { getRepository } from "typeorm";
import { Users } from '../../entity/User';
import { transporter } from './mail/mail'

const register = async (req:Request, res: Response) => {
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

    // 確認信箱格式

    // 確認信箱未被使用
    let isEmailExisted = true
    let emailErrMsg = 'email has been registered'
    const emailStored = await userRepository.findOne( { select:['email'], where: { email: email } } );
    console.log(emailStored)
    if(emailStored === undefined){
        isEmailExisted = false
        emailErrMsg = ""
    }

    // 決定回傳內容
    if(isPasswordValid && !isEmailExisted){
        
        // 產生驗證碼並寄出驗證信
        const verifiedCode = '12345'
        await transporter.sendMail({
            from: '"Malik" smtp.ethereal.email', // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            text: `"Your verifiedCode is: ${verifiedCode} "`, // plain text body
          });

        res.status(HttpStatus.OK)
          .json( { status: HttpStatus.OK, 
                   data: { message: 'please verify email', verified: false } } )
        
        // 儲存使用者資訊
        const user = {
            ...req.body,
            verifiedCode: verifiedCode
        }
        await userRepository.save(user); 
    }
    else
        res.status(HttpStatus.UNAUTHORIZED)
            .json( { status: HttpStatus.UNAUTHORIZED,
                     errors: { email: emailErrMsg, password: passwordErrMsg } } )
}

const verify = async (req: Request, res: Response) => {
    const userRepository = getRepository(Users)
    const { id, verifiedCode} = req.query

    // 驗證 verifiedCode 是否正確
    let verifiedMsg = 'link incorrect'
    const user = await userRepository.findOne( { select:['verifiedCode'], where: { id: id } } );
    
    if(verifiedCode === user.verifiedCode){
        verifiedMsg = 'signup success'
        let user = await userRepository.findOne( { where: { id: id } } )
        user.verified = true
        user.verifiedAt = new Date().toISOString()
        await userRepository.save(user); 
        res.status(HttpStatus.OK).json( { status: HttpStatus.OK, message: verifiedMsg } )
    }else{
        res.status(HttpStatus.UNAUTHORIZED).json( { status: HttpStatus.UNAUTHORIZED, message: verifiedMsg } )
    }
}

const signin = async (req,res) => {
    const userRepository = getRepository(Users)
    const { email, password } = req.body
    
    // 驗證 email 存在
    let isEmailExisted = true
    let emailErrMsg = ''
    const user = await userRepository.findOne( { select:['email'], where: { email: email } } );
    console.log(user)
    if(user === undefined){
        isEmailExisted = false
        emailErrMsg = "email doesn't exist"
    }

    // 從 email 找出對應 password 並驗證 password
    let isPasswordCorrect = true
    let passwordErrMsg = ''
    if(isEmailExisted){
        const user = await userRepository
        .findOne( { select:['password'], where: { email: email } } );
        
        if( user.password !== password){
            isPasswordCorrect = false
            passwordErrMsg = 'password is incorrect'
        }
    }

    if(isPasswordCorrect && isEmailExisted){
        const token = 'wfkmsd'
        res.status(HttpStatus.OK).json( { status: HttpStatus.OK, data: { token: token } } )
    }
    else{
        res.status(HttpStatus.UNAUTHORIZED)
            .json( { status: HttpStatus.UNAUTHORIZED,
                     errors: { email: emailErrMsg, password: passwordErrMsg } } )
    }
}

export { register, verify, signin }