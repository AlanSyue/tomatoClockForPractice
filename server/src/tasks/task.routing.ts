import { Router } from 'express'
import * as controller from "./task.controller"

const taskRoute = Router();

// get
taskRoute.get("/", controller.getTasks);
// post
taskRoute.post("/", controller.postTasks);
// patch
taskRoute.patch("/:id", controller.patchTasks);
// delete
taskRoute.delete("/:id", controller.deleteTasks);

export default taskRoute