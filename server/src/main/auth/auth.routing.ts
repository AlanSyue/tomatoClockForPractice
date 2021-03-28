import { Router } from 'express'
import * as controller from './auth.controller';


const authRouter = Router();

authRouter.route("/register")
    .post(controller.register);

authRouter.route("/verify")
    .get(controller.verify);

authRouter.route("/signin")
    .get(controller.signin);

export default authRouter