import { Router } from 'express';
import taskRoute from './task/task.routing';
import reportRoute from './report/report.routing';

const apiRouter = Router();

apiRouter.use('/tasks', taskRoute);
apiRouter.use('/reports', reportRoute);

export default apiRouter;