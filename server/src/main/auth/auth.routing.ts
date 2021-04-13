import { Router } from "express";
import * as controller from "./auth.controller";
import { registerPipe } from "./auth.pipe";

const authRoute = Router();
const asyncHandler = (action) => {
  return (req, res, next) => {
    return Promise.resolve(action(req, res, next)).catch(next);
  };
};
authRoute.route("/signin").post(asyncHandler(controller.signin));

authRoute.route("/verify").get(asyncHandler(controller.verify));

authRoute
  .route("/register")
  .post(registerPipe, asyncHandler(controller.register));

export default authRoute;
