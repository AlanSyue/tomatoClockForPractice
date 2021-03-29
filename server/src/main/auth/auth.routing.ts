import { Router } from 'express'
import { register, saveAndSend } from './register/register'
import { verify } from './verify/verify'
import { signin } from './signin/signin'


const authRouter = Router();

 authRouter.route("/register")
    .post(register)
    .all(saveAndSend)
    

authRouter.route("/verify")
    .get(verify);

authRouter.route("/signin")
    .post(signin);

export default authRouter