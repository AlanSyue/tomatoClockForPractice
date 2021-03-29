import { Router } from "express";
import * as controller from "./register.controller";

const registerRoute = Router();
const asyncHandler = (action) => {
    return (req, res, next) => {
        return Promise
            .resolve(action(req, res, next))
            .catch(next);
    }
}
registerRoute
    .route("/")
    .post(asyncHandler(controller.register));

export default registerRoute;