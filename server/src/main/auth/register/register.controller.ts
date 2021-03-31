import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../entity/User';
import * as EmailValidator from 'email-validator';
import { body, validationResult, check } from 'express-validator';

var errors = [];
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '2000000000000000000s' });
}

function hasCapital(str)
{
    var result = str.match(/^.*[A-Z]+.*$/);
    if(result==null) return false;
    return true;
}

function hasLowercase(str)
{
    var result = str.match(/^.*[a-z]+.*$/);
    if(result==null) return false;
    return true;
}

function hasNumber(str)
{
    var result = str.match(/^.*[0-9]+.*$/);
    if(result==null) return false;
    return true;
}


export const register = async function (req: Request, res: Response, next: NextFunction) {
    const userRepo = await getRepository(User);
    const password = req.body.password;
    const userEmail = req.body.email;

    const checkEmail = await check('email').notEmpty().isEmail().run(req, { dryRun: true });
    console.log(checkEmail);
    if(!checkEmail.isEmpty()){
        res.status(401).json({status:401, errors: "email 格式錯誤" });
    }

    const checkPassword = await check('password').isLength({ min: 8 }).run(req, { dryRun: true });
    if(!checkPassword.isEmpty() || hasCapital(password)==false || hasLowercase(password)==false || hasNumber(password) == false){
        res.status(401).json({status:401, errors: "密碼需包含英文大小寫和數字，長度超過8位數" });
    }

    if(!(userEmail && password)){
        res.status(401).json({status:401, errors: "Data not formatted properly" });
    }
    
    const emailRepo = await userRepo.find({where: { email: userEmail }});
    if(emailRepo.length != 0){
        res.status(401).json({status:401, errors: "email has been used" });
    }

    if(errors.length != 0){
        res.status(401).json({status:401, error: errors });
        errors = [];
    }

    else{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        const token = generateAccessToken({ username: req.body.email });
        req.body.verifiedCode = token;
        const userCreate = await userRepo.create(req.body);
        const results = await userRepo.save(userCreate);
        res.status(200).json({status:200, messgae: "please verify email"});
    }
}