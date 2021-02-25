import * as express from 'express';
import { Request, Response } from 'express';
import { connectDB } from "./database";
//import { getRepository } from "typeorm";
import { Task } from "./entity/Task";


const startServer = (connection) => {

    const taskRepository = connection.getRepository(Task)

    // create and setup express app
    const app: express.Application = express();
    
    // 解析前端 post 來的資料 
    app.use(express.json());

    // register routes
    app.get("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: 'hello world' });
    });

    // get
    app.get("/api/tasks", async function (req: Request, res: Response) {
        let tasks = await taskRepository.find(); //回傳json檔
        tasks.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)) // sort by id
        const results = {"tasks":tasks}
        res.status(200).json({ status: 200, data: results});
    });

    // post
    app.post("/api/tasks", async function (req: Request, res: Response) {
        try{
            console.log(req.body.content);
            const task = req.body;
            // const task = await taskRepository.create(req.body);
            const results = await taskRepository.save(task);
            res.status(201).json({ status: 201, data: results });
        }catch(err){
            console.log("post error:",err)
            res.status(400).json({ status: 400, message: "'content' is required parameter."})
        }
    });

    // patch
    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            let task = await taskRepository.findOne(req.params.id);
            task.content = req.body.content
            task.completed = req.body.completed
            const results = await taskRepository.save(task);
            res.status(200).json({ status: 200, data: results });
        }catch(err){
            console.log("patch error:",err)
            res.status(400).json({ status: 400, message: "'something went wrong"})
        }
    });

    // delete
    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            const results = await taskRepository.delete(req.params.id);
            res.status(200).json({ status: 200, data: {}});
        }catch(err){
            console.log("delete error:",err)
            res.status(400).json({ status: 400, message: "'something went wrong"})
        }
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    //let connection = await connectDB(); //connectDB 會回傳 connection 
    await startServer(await connectDB());
})()
.then(() => console.log('success'))
.catch(err => console.log(err));



