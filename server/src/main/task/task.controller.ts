import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
import * as moment from "moment";

export const getTasks = async function (req: Request, res: Response) {
    const status = req.query.filterType;
    let needFilter: boolean = false;
    let findObject: object = {};
    if (status != "") {
        needFilter = true;
        findObject = {
            completed: status == "completed" ? true : false
        };
    }
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository.find(findObject);
    res.status(200).json({ status: 200, data: tasks });
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
