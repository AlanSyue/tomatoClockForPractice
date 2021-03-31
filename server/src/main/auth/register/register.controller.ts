import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../entity/User';
import { body, validationResult, check } from 'express-validator';
import { transporter } from '../mail/nodemailer.controller'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '2000000000000000000s' });
}

export const register = async function (req: Request, res: Response, next: NextFunction) {
    const checkEmail = await check('email').notEmpty().isEmail().run(req, { dryRun: true });
    if(!checkEmail.isEmpty()){
        res.status(401).json({status:401, errors: "email 格式錯誤" });
    }
    
    const checkPassword = await check('password').notEmpty().isLength({ min: 8 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").run(req, { dryRun: true });
    if(!checkPassword.isEmpty()){
        res.status(401).json({status:401, errors: "密碼需包含英文大小寫和數字，長度超過8位數" });
    }

    const emailRepo = await getRepository(User).find({where: { email: req.body.email }});
    if(emailRepo.length != 0){
        res.status(401).json({status:401, errors: "email has been used" });
    }

    else{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const token = generateAccessToken({ username: req.body.email });
        req.body.verifiedCode = token;
        const userCreate = await getRepository(User).create(req.body);
        const results = await getRepository(User).save(userCreate);
        res.status(200).json({status:200, messgae: "please verify email"});
    }
}