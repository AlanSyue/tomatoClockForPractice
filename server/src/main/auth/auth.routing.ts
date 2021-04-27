import { Router } from "express";
import * as controller from "./auth.controller";
import { registerPipe } from "./auth.pipe";
import { asyncHandler } from "../../common/utils";

const authRoute = Router();

authRoute.route("/signin").post(asyncHandler(controller.signin));
authRoute.route("/verify").get(asyncHandler(controller.verify));
authRoute
  .route("/register")
  .post(registerPipe, asyncHandler(controller.register));

export default authRoute;
