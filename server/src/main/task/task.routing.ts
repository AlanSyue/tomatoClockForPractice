import { Router } from "express";
import * as controller from "./task.controller";
import { checkJWT } from "../../common/checkJWT";
import { asyncHandler } from "../../common/utils";

const taskRoute = Router();
taskRoute
  .route("/")
  .get(checkJWT, asyncHandler(controller.getTasks))
  .post(checkJWT, asyncHandler(controller.createTask));

taskRoute
  .route("/:id")
  .patch(checkJWT, controller.updateTask)
  .delete(checkJWT, controller.removeTask);

export default taskRoute;
