import * as express from 'express';
import { Request, Response } from 'express';
import { connectDB } from "./database";
import { getRepository } from "typeorm";
import { Task } from "./entity/Task";


const startServer = () => {

    // create and setup express app
    const app: express.Application = express();
    
    // 解析前端 post 來的資料 
    app.use(express.json());

    // register routes
    app.get("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: 'hello world' });
    });

    // 方便後續資料庫操作 (想問學長是否需要加上 await 並且在 startServer 那行增加 async?)
    const taskRepository = getRepository(Task)

    // get
    app.get("/api/tasks", async function (req: Request, res: Response) {
        
        let tasks;
        const filterType = req.body.filterType;

        if( filterType === "completed" 
            || filterType === "uncompleted"
            || filterType === "")
        {
            if(filterType === "completed"){
                tasks =  await taskRepository.find({
                    where: { completed: true }
                });
            }
            else if(filterType === "uncompleted"){
                tasks =  await taskRepository.find({
                    where: { completed: false }
                });
            }
            else if(filterType === ""){
                tasks =  await taskRepository.find()
            }
            
            tasks.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)); // sort by id
            const results = {"tasks":tasks};
            res.status(200).json({ status: 200, data: results});
        }
        else{
            const results = "bad request";
            res.status(400).json({ status: 400, message: results});
        }

    });

    // post
    app.post("/api/tasks", async function (req: Request, res: Response) {
        try{
            const task = req.body;
            // const task = await taskRepository.create(req.body);
            const results = await taskRepository.save(task);
            res.status(201).json({ status: 201, data: results });
        }catch(err){
            // console.log("post error:",err)
            res.status(400).json({ status: 400, message: "'content' is required parameter."})
        }
    });

    // patch
    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            let task = await taskRepository.findOne(req.params.id);
            if(req.body.content !== undefined){
                task.content = req.body.content
            }
            if(req.body.completed !== undefined){
                task.completed = req.body.completed
            }
            const results = await taskRepository.save(task);
            res.status(200).json({ status: 200, data: results });
        }catch(err){
            res.status(400).json({ status: 400, message: "bad request"})
        }
    });

    // delete
    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            const results = await taskRepository.delete(req.params.id);
            res.status(200).json({ status: 200, data: {}});
        }catch(err){
            res.status(400).json({ status: 400, message: "bad request"})
        }
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB(); //connectDB 會回傳 connection 
    await startServer();
})()



