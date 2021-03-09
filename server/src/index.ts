import * as express from 'express';
import { Request, Response } from 'express';
import { connectDB } from "./database";
import { getRepository } from "typeorm";
import { Task } from "./entity/Task";
import taskRoute from "./main /task/task.routing";

const startServer = () => {
    // create and setup express app
    const app: express.Application = express();
    app.use(express.json());
    app.use('/api/tasks', taskRoute);

<<<<<<< Updated upstream
    // register routes
    app.get("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: 'hello world' });
    });

    app.get("/api/tasks", async function (req: Request, res: Response) {
        const tasks = await getRepository(Task).find();
        res.status(200).json({ status: 200, data: tasks });
    });
=======
    // app.use(function(err, req, res, next){
    //     console.error(err.stack);
    //     res.status(500).send('something broke');
    // })
>>>>>>> Stashed changes

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
