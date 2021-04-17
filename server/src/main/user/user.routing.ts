import { Router } from "express";
import * as controller from "./user.contoller";
import { checkJWT } from "../common/checkJWT";

const userRoute = Router();
const asyncHandler = (action) => {
  return (req, res, next) => {
    return Promise.resolve(action(req, res, next)).catch(next);
  };
};
userRoute.route("/").get(checkJWT, asyncHandler(controller.getUser));

export default userRoute;
