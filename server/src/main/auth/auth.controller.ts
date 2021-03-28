import { Request, Response } from 'express';
import { HttpStatus } from '../../common/response/response.type'
import { getRepository, Between } from "typeorm";
import { Users } from "../../entity/User";

const register = async (req,res) => {
    const userRepository = getRepository(Users)
    const { name, email, password } = req.body

    // 確認密碼格式
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    let isPasswordValid = false
    let passwordErrMsg = ''
    if(passwordRules.test(password)){
        isPasswordValid = true
        passwordErrMsg = "password's format is incorrect"
    }

    // 確認信箱格式

    // 確認信箱未被使用
    let isEmailExisted = false
    let emailErrMsg = ''
    const emailStored = await userRepository.find( { select:['email'], where: { email:email } } );
    console.log(emailStored)
    if(emailStored !== email){
        isEmailExisted = true
        emailErrMsg = "email has been registered"
    }

    // 決定回傳內容
    if(isPasswordValid && isEmailExisted)
        res.status(HttpStatus.OK)
            .json( { status: HttpStatus.OK, 
                     data: { message: 'please verify email', verified: false } } )
    else
        res.status(HttpStatus.UNAUTHORIZED)
            .json( { status: HttpStatus.UNAUTHORIZED,
                     errors: { email: emailErrMsg, password: passwordErrMsg } } )
}

const verify = async (req,res) => {
    
}

const signin = async (req,res) => {
    const userRepository = getRepository(Users)
    const { email, password } = req.body
    
    // 驗證 email 存在
    let isEmailExisted = true
    let emailErrMsg = ''
    const emailStored = await userRepository.find( { select:['email'], where: { email: email } } );
    console.log(emailStored)
    if(emailStored !== email){
        isEmailExisted = false
        emailErrMsg = "email doesn't exist"
    }

    // 從 email 找出對應 password 並驗證 password
    let isPasswordCorrect = true
    let passwordErrMsg = ''
    if(isEmailExisted){
        const passwordStored = await userRepository
        .find( { select:['password'], where: { email: email } } );
        
        if( passwordStored !== password){
            isPasswordCorrect = false
            passwordErrMsg = 'password is incorrect'
        }
    }

    if(isPasswordCorrect && !isEmailExisted){
        const verifiedCode = await userRepository
        .find( { select:['verifiedCode'], where: { email: email} } )
        res.status(HttpStatus.OK).json( { status: HttpStatus.OK, data: { token: verifiedCode } } )
    }
    else{
        res.status(HttpStatus.UNAUTHORIZED)
            .json( { status: HttpStatus.UNAUTHORIZED,
                     errors: { email: emailErrMsg, password: passwordErrMsg } } )
    }
}

export { register, verify, signin }