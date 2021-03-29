import { Router } from "express";
import * as controller from "./verify.controller";

const verifyRoute = Router();
const asyncHandler = (action) => {
    return (req, res, next) => {
        return Promise
            .resolve(action(req, res, next))
            .catch(next);
    }
}
verifyRoute
    .route("/")
    .get(asyncHandler(controller.verify));

export default verifyRoute;