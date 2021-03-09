import { Router } from "express";
import * as controller from "./task.controller";

const taskRoute = Router();
// const asyncHandler = (action) => {
//     return (req, res, next) => {
//         return Promise
//             .resolve(action(req, res, next))
//             .catch(next);
//     }
// }
taskRoute
    .route("/")
    .get(controller.getTasks)
    .post(controller.createTask);

taskRoute
    .route("/:id")
    .patch(controller.updateTask)
    .delete(controller.removeTask);

export default taskRoute;