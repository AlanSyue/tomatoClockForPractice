import * as express from 'express';
import { Router } from 'express';
import * as controller from './task.controller';
import { asyncHandler, responseHandler } from '../../common/utils';

const taskRouter = Router();

taskRouter.route('/')
    .get(responseHandler(controller.getTasks))
    .post(
        express.json(),
        asyncHandler(controller.addTask)
    );

taskRouter.route('/:id')
    .patch(
        express.json(),
        asyncHandler(controller.updateTask)
    )
    .delete(
        asyncHandler(controller.removeTask)
    );

export default taskRouter;