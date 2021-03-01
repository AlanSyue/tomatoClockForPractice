import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
import { formatResponse } from "../../common/utils";
import { HttpStatus } from "../../common/response/response.type";
import * as moment from "moment";
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

export const addTask = async function (req: Request, res: Response) {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.create(req.body)
    const result = await taskRepository.save(task);
    res.status(200).json({ status: 200, data: result });
};

export const updateTask = async function (req: Request, res: Response) {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOne(req.params.id);
    const {
        content,
        completed
    } = req.body;

    let updateData = {};
    if (content) {
        updateData['content'] = content;
    }
    if (completed) {
        updateData['completed'] = completed;
        updateData['completedAt'] = completed ? moment() : null;
    }
    taskRepository.merge(task, updateData);
    const result = await taskRepository.save(task);
    res.status(200).json({ status: 200, data: result });
};

export const removeTask = async function (req: Request, res: Response) {
    const taskRepository = getRepository(Task);
    await taskRepository.delete(req.params.id);
    res.status(200).json({ status: 200, data: {} });
};
