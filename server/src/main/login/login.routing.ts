import { Router } from "express";
import * as controller from "./login.controller";

const loginRoute = Router();
const asyncHandler = (action) => {
    return (req, res, next) => {
        return Promise
            .resolve(action(req, res, next))
            .catch(next);
    }
}
loginRoute
    .route("/")
    .post(asyncHandler(controller.login));

export default loginRoute;