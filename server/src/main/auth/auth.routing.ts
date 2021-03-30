import { Router } from "express";
import { register } from "./register/register.controller";
import { login } from "./login/login.controller";
import { verify } from "./verify/verify.controller";

const authRoute = Router();
const asyncHandler = (action) => {
    return (req, res, next) => {
        return Promise
            .resolve(action(req, res, next))
            .catch(next);
    }
}
authRoute
    .route("/login")
    .post(asyncHandler(login));

authRoute
    .route("/verify")
    .get(asyncHandler(verify));

authRoute
    .route("/register")
    .post(asyncHandler(register));

export default authRoute;