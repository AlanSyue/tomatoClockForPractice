import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';
var errors = [];

export const login = async function (req: Request, res: Response){
    const bcrypt = require('bcryptjs');
    const body = req.body;
    const user = await getRepository(User).findOne({ email: body.email });
    if (!user || user.verified == false) {
        if(!user){
            errors.push("email doesn't exist");
        }
        else{
            errors.push("please verify your email")
        }
    } 
    else {
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword) {
            errors.push("password incorrect");
        } 
    }

    if(errors.length != 0){
        res.status(401).json({status:401, errors: errors });
        errors = [];
    }
    else{
        res.status(200).json({status:200, data:"" });
    }
}
