import * as express from 'express';
import { Router } from 'express';
import * as controller from './auth.controller';
import { responseHandler } from '../../common/utils';
import { registerPipe, signinPipe, verifyPipe } from './auth.pipe';

const taskRouter = Router();

taskRouter.post('/register',
    express.json(),
    registerPipe,
    responseHandler(controller.register)
)

taskRouter.post('/signin',
    express.json(),
    signinPipe,
    responseHandler(controller.signin)
)

taskRouter.post('/verify',
    express.json(),
    verifyPipe,
    responseHandler(controller.verify)
)

export default taskRouter;