import { Request } from 'express';
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import * as taskRepository from "../../repositories/task.repository";
import { ResponseTaskDTO } from "../../dtos/task.dto";
import { ResponseObject } from "../../common/response/response.object";

export const getTasks = async function (req: Request): Promise<ResponseObject<ResponseTaskDTO[]>> {
    const {
        filterType: status = ""
    } = req.query;

    const isCompleted = status == "completed" ? true : false;
    const tasks = await taskRepository.getTasks({ isCompleted });
    const dtos = tasks.map(task => new ResponseTaskDTO(task));
    return formatResponse(dtos, HttpStatus.OK);
};

export const addTask = async function (req: Request): Promise<ResponseObject<ResponseTaskDTO>> {
    const task = await taskRepository.addTask(req.body);
    const dto = new ResponseTaskDTO(task)
    return formatResponse(dto, HttpStatus.OK);
};

export const updateTask = async function (req: Request): Promise<ResponseObject<ResponseTaskDTO>> {
    const task = await taskRepository.updateTask(req.body);
    if(!task){
        throw Error("Update fails.");
    }
    const dto = new ResponseTaskDTO(task)
    return formatResponse(dto, HttpStatus.OK);
};

export const removeTask = async function (req: Request): Promise<ResponseObject<any>> {
    const id = Number(req.params.id);
    const isSuccess = await taskRepository.removeTask(id);
    if (isSuccess) {
        return formatResponse({}, HttpStatus.OK);
    } else {
        let error = Error('The task was deleted.');
        (error as any).status = 400;
        throw error;
    }
};

export const test = async function (req: Request): Promise<ResponseObject<any>> {
    return formatResponse(req.body, HttpStatus.OK);
};