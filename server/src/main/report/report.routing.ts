import { Router } from 'express';
import * as controller from './report.controller';
import { asyncHandler } from '../../common/utils';

const reportRouter = Router();

reportRouter.route('/')
    .get(asyncHandler(controller.getReport));

export default reportRouter;