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

    //get 取得全部待辦事項
    app.get("/api/tasks", async function (req: Request, res: Response) {
        const filterType = req.body.filterType;
        let results;
        if(filterType === "" || filterType === "completed" || filterType === "uncompleted"){
            if(filterType === ""){
                results = await getRepository(Task).find();
            }
            else if(filterType === "completed"){
                results =  await getRepository(Task).find({where: { completed: true }});
            }
            else if(filterType === "uncompleted"){
                results =  await getRepository(Task).find({where: { completed: false }});
            }
            res.status(200).json({ status: 200, data:{results} });
        }
        else{
            res.status(400).json({ status: 400, message:"failed getting data"});
        }
        
    });

    //post 新增待辦事項
    app.post("/api/tasks", async function (req: Request, res: Response) {
        const content = req.body.content;
        if(content != null && content !== undefined){
            try{
            
                const content_create = await getRepository(Task).create(req.body);
                const results = await getRepository(Task).save(content_create);
                res.status(201).json({ status: 201, data: {results} });
            }
            catch(err){
                res.status(400).json({status: 400, message: "'content' is required parameter."});
            }
        }
        else{
            res.status(400).json({status: 400, message: "'content' is undefined"});
        }
        
        
    });

    // patch 修改指定待辦事項資料
    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            const id = await getRepository(Task).findOne(req.params.id);
            const content_patch = await getRepository(Task).merge(id, req.body);
            const results = await getRepository(Task).save(content_patch);
            res.status(200).json({ status: 201, data: {results} });
        }
        catch(err){
            res.status(400).json({ status: 400, message: "request went wrong"});
        }
        
    });


    //delete 刪除待辦事項
    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        try{
            const results = await getRepository(Task).delete(req.params.id);
            res.status(200).json({ status: 200, data: {} });
        }
        catch(err){
            res.status(400).json({ status: 400, message: "delete went wrong"});
        }
        
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
