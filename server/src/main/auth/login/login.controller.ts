import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../entity/User';
var errors = [];

export const login = async function (req: Request, res: Response){
    const bcrypt = require('bcryptjs');
    const body = req.body;
    const user = await getRepository(User).findOne({ email: body.email });
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
