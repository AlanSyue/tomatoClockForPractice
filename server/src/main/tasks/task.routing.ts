import { Router } from 'express'
import * as controller from "./task.controller"
import { responseHandler } from "../../common/util"

const taskRouter = Router();
const { getTasks, postTasks, patchTasks, deleteTasks } = controller

taskRouter.route("/")
    .get(responseHandler(getTasks))
    .post(responseHandler(postTasks))
    
taskRouter.route("/:id")
    .patch(responseHandler(patchTasks))
    .delete(responseHandler(deleteTasks))

export default taskRouter