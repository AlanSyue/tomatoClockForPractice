import { Repository, getRepository } from "typeorm";
import { Task } from "../entity/Task";
import * as moment from "moment";

interface IGetTaskParams {
    isCompleted: boolean
}

export const getTasks = async function ({ isCompleted = false }: IGetTaskParams): Promise<Array<Task>> {
    const repository: Repository<Task> = getRepository(Task);
    const tasks = await repository.find({
        completed: isCompleted
    });
    return tasks;
};

interface IAddTaskParams {
    content: string
}
export const addTask = async function (params: IAddTaskParams): Promise<Task> {
    const repository: Repository<Task> = getRepository(Task);
    const task = await repository.create(params);
    return await repository.save(task);
};

interface IUpdateTaskParams {
    id: number,
    content?: string,
    completed?: string,
}
export const updateTask = async function (params: IUpdateTaskParams): Promise<Task> {
    const repository: Repository<Task> = getRepository(Task);
    const {
        id,
        content,
        completed
    } = params;

    let updateData = {};
    if (content !== undefined) {
        updateData['content'] = content;
    }
    if (completed !== undefined) {
        updateData['completed'] = completed;
        updateData['completedAt'] = completed ? moment() : null;
    }

    const task = await repository.findOne(id);
    repository.merge(task, updateData);
    return await repository.save(task);
};

export const removeTask = async function (id: number): Promise<boolean> {
    const repository: Repository<Task> = getRepository(Task);
    const { affected } = await repository.delete(id);
    return Boolean(affected);
};