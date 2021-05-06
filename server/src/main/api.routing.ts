import { Router } from 'express';
import authRoute from './auth/auth.routing';
import userRoute from './user/user.routing';
import taskRoute from './task/task.routing';
import reportRoute from './report/report.routing';
import { authMiddleware } from '../common/auth';

const apiRouter = Router();

apiRouter.use('/auth', authRoute);
apiRouter.use('/tasks', taskRoute);
apiRouter.use('/reports', reportRoute);
apiRouter.use('/user', authMiddleware, userRoute);

export default apiRouter;