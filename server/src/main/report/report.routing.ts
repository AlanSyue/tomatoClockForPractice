import { Router } from "express";
import * as controller from "./report.controller";
import { checkJWT } from "../../common/checkJWT";

const reportRoute = Router();
const asyncHandler = (action) => {
    return (req, res, next) => {
        return Promise
            .resolve(action(req, res, next))
            .catch(next);
    }
}
reportRoute
    .route("/")
    .get(checkJWT, asyncHandler(controller.getReports));

export default reportRoute;