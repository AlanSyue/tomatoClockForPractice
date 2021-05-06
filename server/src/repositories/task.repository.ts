import { Repository, getRepository } from "typeorm";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import moment from "moment";
interface IGetTaskParams {
    user: User
    isCompleted: boolean
}

export const getTasks = async function ({ user, isCompleted = false }: IGetTaskParams): Promise<Array<Task>> {
    const repository: Repository<Task> = getRepository(Task);
    const tasks = await repository.find({
        user: user,
        completed: isCompleted
    });
    return tasks;
};

interface IAddTaskParams {
    user: User
    content: string
}
export const addTask = async function (params: IAddTaskParams): Promise<Task> {
    const repository: Repository<Task> = getRepository(Task);
    const task = await repository.create(params);
    return await repository.save(task);
};

interface IUpdateTaskParams {
    id: number,
    user: User,
    content?: string,
    completed?: string,
}
export const updateTask = async function (params: IUpdateTaskParams): Promise<Task | null> {
    const repository: Repository<Task> = getRepository(Task);
    const {
        id,
        user,
        content,
        completed
    } = params;

    let updateData: any = {};
    if (content !== undefined) {
        updateData['content'] = content;
    }
    if (completed !== undefined) {
        updateData['completed'] = completed;
        updateData['completedAt'] = completed ? moment() : null;
    }

    const task = await repository.findOne({
        id: id,
        user
    });

    if (!task) {
        return null;
    }
    repository.merge(task, updateData);
    return await repository.save(task);
};
interface IRemoveTaskParams {
    id: number,
    user: User
}
export const removeTask = async function ({ id, user }: IRemoveTaskParams): Promise<boolean> {
    const repository: Repository<Task> = getRepository(Task);
    const { affected } = await repository.delete({
        id,
        user
    });
    return Boolean(affected);
};