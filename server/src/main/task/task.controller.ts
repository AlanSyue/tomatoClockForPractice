import { Request, Response } from 'express';
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import * as taskRepository from "../../repositories/task.repository";
import { ResponseTaskDTO } from "../../dtos/task.dto";
import { ResponseObject } from "../../common/response/response.object";

export const getTasks = async function (req: Request, res: Response): Promise<ResponseObject<ResponseTaskDTO[]>> {
    const {
        filterType: status = ""
    } = req.query;
    const user = res.locals.user;
    console.log(user);
    const isCompleted = status == "completed" ? true : false;
    const tasks = await taskRepository.getTasks({ user, isCompleted });
    const dtos = tasks.map(task => new ResponseTaskDTO(task));
    return formatResponse(dtos, HttpStatus.OK);
};

export const addTask = async function (req: Request, res: Response): Promise<ResponseObject<ResponseTaskDTO>> {
    const user = res.locals.user;
    const task = await taskRepository.addTask({
        ...req.body,
        user
    });
    const dto = new ResponseTaskDTO(task)
    return formatResponse(dto, HttpStatus.OK);
};

export const updateTask = async function (req: Request, res: Response): Promise<ResponseObject<ResponseTaskDTO>> {
    const user = res.locals.user;
    const id = Number(req.params.id);
    const task = await taskRepository.updateTask({
        ...req.body,
        id,
        user
    });
    if (!task) {
        const e = new Error(`Update fails.`);
        (e as any).status = HttpStatus.BAD_REQUEST;
        throw e;
    }
    const dto = new ResponseTaskDTO(task)
    return formatResponse(dto, HttpStatus.OK);
};

export const removeTask = async function (req: Request, res: Response): Promise<ResponseObject<any>> {
    const id = Number(req.params.id);
    const user = res.locals.user;
    const isSuccess = await taskRepository.removeTask({ id, user });
    if (isSuccess) {
        return formatResponse({}, HttpStatus.OK);
    } else {
        let error = Error('The task was deleted.');
        (error as any).status = 400;
        throw error;
    }
};
