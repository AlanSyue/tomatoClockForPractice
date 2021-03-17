import * as express from 'express';
import { Router } from 'express';
import * as controller from './task.controller';
import { responseHandler } from '../../common/utils';
import { testPipe } from './task.pipe';

const taskRouter = Router();

taskRouter.route('/')
    .get(responseHandler(controller.getTasks))
    .post(
        express.json(),
        responseHandler(controller.addTask)
    );

taskRouter.route('/:id')
    .patch(
        express.json(),
        responseHandler(controller.updateTask)
    )
    .delete(
        responseHandler(controller.removeTask)
    );

taskRouter.route('/test')
    .post(
        express.json(),
        testPipe,
        responseHandler(controller.test)
    )


export default taskRouter;