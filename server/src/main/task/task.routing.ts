import { Router } from "express";
import * as controller from "./task.controller";
import { checkJWT } from "../../common/checkJWT";

const taskRoute = Router();
const asyncHandler = (action) => {
  return (req, res, next) => {
    return Promise.resolve(action(req, res, next)).catch(next);
  };
};
taskRoute
  .route("/")
  .get(checkJWT, asyncHandler(controller.getTasks))
  .post(checkJWT, asyncHandler(controller.createTask));

taskRoute
  .route("/:id")
  .patch(checkJWT, controller.updateTask)
  .delete(checkJWT, controller.removeTask);

export default taskRoute;
