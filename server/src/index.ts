import * as express from 'express';
import { connectDB } from "./database";
import taskRoute from "./main/task/task.routing";
import reportRoute from "./main/report/report.routing";
import loginRoute from "./main/login/login.routing";
import registerRoute from "./main/register/register.routing";
import verifyRoute from "./main/verify/verify.routing";

const startServer = () => {
    // create and setup express app
    const app: express.Application = express();
    app.use(express.json());
    app.use('/api/tasks', taskRoute);
    app.use('/api/reports', reportRoute);
    app.use('/api/auth/login', loginRoute);
    app.use('/api/auth/register', registerRoute);
    app.use('/api/auth/verify', verifyRoute);


    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500).send('something broke');
    })

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
