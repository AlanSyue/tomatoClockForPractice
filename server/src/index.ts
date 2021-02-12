import * as express from 'express';
import { Request, Response } from 'express';
import { connectDB } from "./database";
import { getRepository } from "typeorm";
import { Task } from "./entity/Task";

const startServer = () => {
    // create and setup express app
    const app: express.Application = express();
    app.use(express.json());

    // register routes
    app.get("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: 'hello world' });
    });

    app.get("/api/tasks", async function (req: Request, res: Response) {
        const tasks = await getRepository(Task).find();
        res.status(200).json({ status: 200, data: tasks });
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
