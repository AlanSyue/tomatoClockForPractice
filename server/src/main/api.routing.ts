import { Router } from 'express';
import taskRouter from './tasks/task.routing';
import reportRouter from './reports/report.routing';
import authRouter from './auth/auth.routing'

const apiRouter = Router();

apiRouter.use('/tasks', taskRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/auth', authRouter)

export default apiRouter;