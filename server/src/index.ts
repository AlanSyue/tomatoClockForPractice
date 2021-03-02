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
        const filterType = req.body.filterType;
        console.log(req.QueryString["type"]);
        if(typeof(filterType) === 'string'){
            const tasks = await getRepository(Task).find();
            res.status(200).json({ status: 200, data:{tasks} });
        }
    });

    //post 新增待辦事項
    app.post("/", function (req: Request, res: Response) {
        res.status(201).json({ status: 201, data: 'post api' });
    });

    app.post("/api/tasks", async function (req: Request, res: Response) {
        if(req.body){
            const content = req.body.content;
            const content_create = await getRepository(Task).create(req.body);
            const results = await getRepository(Task).save(content_create);
            res.status(201).json({ status: 201, data: {results} });
        }
        else{
            console.log(req.body);//{}
            res.status(400).json({status: 400, message: "'content' is required parameter."})
        }
    });

    // patch 修改指定待辦事項資料
    app.patch("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: '修改指定待辦事項資料' });
    });

    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        const id = await getRepository(Task).findOne(req.params.id);
        console.log(id);
        console.log(req.body);
        const content_patch = await getRepository(Task).merge(id, req.body);
        const results = await getRepository(Task).save(content_patch);
        res.status(200).json({ status: 201, data: {results} });
    });


    //delete 刪除待辦事項
    app.delete("/", function (req: Request, res: Response) {
        res.status(200).json({ status: 200, data: '刪除' });
    });

    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        const results = await getRepository(Task).delete(req.params.id);
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
