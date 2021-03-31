import { Router } from "express";
import * as controller from "./auth.controller";

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
    .post(asyncHandler(controller.login));

authRoute
    .route("/verify")
    .get(asyncHandler(controller.verify));

authRoute
    .route("/register")
    .post(asyncHandler(controller.register));

export default authRoute;