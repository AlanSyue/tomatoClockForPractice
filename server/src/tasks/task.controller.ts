import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";
import { isBoolean } from 'util';

const getTasks = async function (req: Request, res: Response) {  
    const index = ['completed','uncompleted',''].indexOf(req.query.filterType as string);
    if(index === -1){
        res.status(400).json({ status: 400, message: "bad request"});
    }
    else{
        const selectTask = condition => async () => await getRepository(Task).find(condition)
        const selectTasks = [
            selectTask({where: { completed: true }, order: { id: "ASC"}}),
            selectTask({where: { completed: false }, order: { id: "ASC"}}),
            selectTask({order: { id: "ASC"}})
        ]
        selectTasks[index]()
        .then(tasks => res.status(200).json({ status: 200, data: {"tasks":tasks}}))
        .catch(err => res.status(400).json({status:400, message: err}))
    }
}

const postTasks = async function (req: Request, res: Response) {
    try{
        const results = await getRepository(Task).save(req.body);
        res.status(201).json({ status: 201, data: results });
    }catch(err){
        res.status(400).json({ status: 400, message: "'content' is required parameter."})
    }
}

const patchTasks = async function (req: Request, res: Response) {
    const taskRepository = getRepository(Task)
    try{
        let task = await taskRepository.findOne(req.params.id);
        if(req.body.content !== undefined){
            task.content = req.body.content;
        }
        if(isBoolean(req.body.completed)){
            task.completed = req.body.completed;
            if(req.body.completed == true)
                task.completedAt = new Date().toISOString()
        }
        const results = await taskRepository.save(task);
        res.status(200).json({ status: 200, data: results });
    }catch(err){
        res.status(400).json({ status: 400, message: "bad request"})
    }
}

const deleteTasks = async function (req: Request, res: Response) {
    try{
        await getRepository(Task).delete(req.params.id);
        res.status(200).json({ status: 200, data: {}});
    }catch(err){
        res.status(400).json({ status: 400, message: "bad request"})
    }
}


export { getTasks, postTasks, patchTasks, deleteTasks }