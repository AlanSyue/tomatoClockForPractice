import { Router } from "express";
import * as controller from "./report.controller";
import { checkJWT } from "../../common/checkJWT";
import { asyncHandler } from "../../common/utils";

const reportRoute = Router();
reportRoute.route("/").get(checkJWT, asyncHandler(controller.getReports));

export default reportRoute;
