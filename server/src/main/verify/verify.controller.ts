import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';

const jwt = require('jsonwebtoken');
var moment = require('moment');

const verifyRoute = Router();
export const verify = async function (req:Request, res:Response, next:NextFunction){
    const userRepo = await getRepository(User);
    const token = req.query.verifiedCode;
    if (!token)
        return res.status(403).json({status:403, auth: false, message: 'No token provided.' });
    jwt.verify(token,'mynewproject', async function(err, decoded) {
        if (err){
            return res.status(500).json({status:500, auth: false, message: err });
        }
        else{
            req.body.verified = true;
            console.log(req.body.verified);
            const timestamp = moment().valueOf();
            const formattedTime = moment(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS')
            req.body.verifiedAt = formattedTime;
            const id = await userRepo.findOne({where: { id: req.query.id }});
            const userVerified = userRepo.merge(id, req.body);
            const results = userRepo.save(userVerified);
            res.status(200).json({status:200, message: "signup success"});
        }
        
        next();
    });
  
}

export default verifyRoute;