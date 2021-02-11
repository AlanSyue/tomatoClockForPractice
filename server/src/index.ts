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
    app.get("/api/tasks", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const tasks = await taskRepository.find();
        res.status(200).json({ status: 200, data: tasks });
    });

    app.post("/api/tasks", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const task = await taskRepository.create(req.body)
        const result = await taskRepository.save(task);
        res.status(200).json({ status: 200, data: result });
    });

    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const task = await taskRepository.findOne(req.params.id);
        taskRepository.merge(task, req.body);
        const result = await taskRepository.save(task);
        res.status(200).json({ status: 200, data: result });
    });

    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        await taskRepository.delete(req.params.id);
        res.status(200).json({ status: 200, data: {} });
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
