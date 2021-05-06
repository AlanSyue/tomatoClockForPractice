import { Router } from 'express';
import * as controller from './user.controller';
import { responseHandler } from '../../common/utils';

const userRouter = Router();

userRouter.get('/', responseHandler(controller.getUser))
export default userRouter;