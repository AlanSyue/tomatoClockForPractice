import { Request } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
import { ResponseTaskDTO } from "../../dtos/task.dto"
import { formatResponse } from "../../common/util";
import { HttpStatus } from "../../common/response/response.type"
import { isBoolean } from 'util';

const getTasks = async function (req: Request) {  
    const typeMap = {
        completed: { where: { completed: true }, order: { id: "ASC" } },
        uncompleted: { where: { completed: false }, order: { id: "ASC" } },
        default: { order: { id: "ASC" } }
    }
    
    const filterType: string = String(req.query.filterType) || 'default';
    if(!Object.keys(typeMap).includes(filterType)){
        throw Error('bad request');
    }
    const condition = typeMap[filterType]
    
    const tasks: Task[] = await getRepository(Task).find(condition);
    const dtos = tasks.map(task => new ResponseTaskDTO(task));
    return formatResponse(dtos, HttpStatus.OK)
}

const postTasks = async function (req: Request) {
    const task = await getRepository(Task).save(req.body);
    const dto = new ResponseTaskDTO(task)
    return formatResponse(dto, HttpStatus.OK)
}

const patchTasks = async function (req: Request) {
    const taskRepository = getRepository(Task)
    const task = await taskRepository.findOne(req.params.id);
    if(req.body.content !== undefined){
        task.content = req.body.content;
    }
    if(isBoolean(req.body.completed)){
        task.completed = req.body.completed;
        if(req.body.completed == true)
            task.completedAt = String(new Date(new Date().toISOString()))
    }
    const updatedTask = await taskRepository.save(task);
    const dto = new ResponseTaskDTO(updatedTask)
    return formatResponse(dto,HttpStatus.OK)
}

const deleteTasks = async function (req: Request) {
    await getRepository(Task).delete(req.params.id);
    return formatResponse({},HttpStatus.OK)
}

export { getTasks, postTasks, patchTasks, deleteTasks }