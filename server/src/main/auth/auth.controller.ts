import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';
import { body, validationResult, check } from 'express-validator';
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';


export const verify = async function (req:Request, res:Response, next:NextFunction){
    const userRepo = getRepository(User);
    const token = req.query.verifiedCode;
    if (!token)
        return res.status(403).json({status:403, auth: false, message: 'No token provided.' });
    jwt.verify(token,process.env.TOKEN_SECRET, async function(err, decoded) {
        if (err){
            return res.status(500).json({status:500, auth: false, message: err });
        }
        else{
            req.body.verified = true;
            const formattedTime = moment(moment().valueOf()).format('YYYY-MM-DDTHH:mm:ss.SSS')
            req.body.verifiedAt = formattedTime;
            const id = await userRepo.findOne({where: { id: req.query.id }});
            const userVerified = userRepo.merge(id, req.body);
            const results = userRepo.save(userVerified);
            res.status(200).json({status:200, message: "signup success"});
        }
        
        next();
    });
  
}

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

    const emailRepo = getRepository(User).find({where: { email: req.body.email }});
    if(emailRepo.length != 0){
        res.status(401).json({status:401, errors: "email has been used" });
    }

    else{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const token = generateAccessToken({ username: req.body.email });
        req.body.verifiedCode = token;
        const userCreate = getRepository(User).create(req.body);
        const results = getRepository(User).save(userCreate);
        res.status(200).json({status:200, messgae: "please verify email"});
    }
}

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
});

export const login = async function (req: Request, res: Response){
    const bcrypt = require('bcryptjs');
    const body = req.body;
    const user = getRepository(User).findOne({ email: body.email });
    if(!user){
        res.status(401).json({status:401, errors: "email doesn't exist" });
    }
    if(user.verified == false){
        res.status(401).json({status:401, errors: "please verify your email" });
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if(!validPassword) {
        res.status(401).json({status:401, errors: "password incorrect" });
    } 
    else {
        res.status(200).json({status:200, data:"" });
    }
}