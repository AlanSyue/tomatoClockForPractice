import { Request, Response, Router } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";

const taskRoute = Router();
//把 api 相關內容放進 controller
//get 取得全部待辦事項
export const getTasks = async function (req: Request, res: Response) {
    const filterType:string = String(req.query.filterType);
    const isFilterTypeValid = ["", "completed", "uncompleted"].includes(filterType);

    console.log(filterType);
    console.log(isFilterTypeValid);
    if(!isFilterTypeValid){
        res.status(400).json({ status: 400, message:"failed getting data"});
    }
    let tasks;
    if(filterType === "completed"){
        tasks =  await getRepository(Task).find({where: { completed: true }});
        res.status(200).json({ status: 200, tasks });
    }
    else if(filterType === "uncompleted"){
        tasks =  await getRepository(Task).find({where: { completed: false }});
        res.status(200).json({ status: 200, tasks });
    }
    else if(filterType === ""){
        tasks = await getRepository(Task).find();
        res.status(200).json({ status: 200, tasks });
    }
    

    // let tasks;
    // if(filterType === "" || filterType === "completed" || filterType === "uncompleted"){
    //     if(filterType === ""){
    //         tasks = await getRepository(Task).find();
    //     }
    //     else if(filterType === "completed"){
    //         tasks =  await getRepository(Task).find({where: { completed: true }});
    //     }
    //     else if(filterType === "uncompleted"){
    //         tasks =  await getRepository(Task).find({where: { completed: false }});
    //     }
    //     res.status(200).json({ status: 200, tasks });
    // }
    // else{
    //     console.log("hi");
    //     res.status(400).json({ status: 400, message:"failed getting data"});
    // }
    
};

//post 新增待辦事項
export const createTask = async function (req: Request, res: Response) {
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
    
    
};

// patch 修改指定待辦事項資料
export const updateTask = async function (req: Request, res: Response) {
    try{
        const id = await getRepository(Task).findOne(req.params.id);
        const content_patch = getRepository(Task).merge(id, req.body);//這邊不用 await
        const results = await getRepository(Task).save(content_patch);//save 才真的存進資料庫
        res.status(200).json({ status: 201, data: {results} });
    }
    catch(err){
        res.status(400).json({ status: 400, message: "request went wrong"});
    }
    
};

//delete 刪除待辦事項
export const removeTask = async function (req: Request, res: Response) {
    try{
        const results = await getRepository(Task).delete(req.params.id);
        res.status(200).json({ status: 200, data: {} });
    }
    catch(err){
        res.status(400).json({ status: 400, message: "delete went wrong"});
    }
    
};
export default taskRoute;