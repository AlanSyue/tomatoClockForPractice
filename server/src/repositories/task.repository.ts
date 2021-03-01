import { Repository, getRepository } from "typeorm";
import { Task } from "../entity/Task";
interface IGetTaskParams {
    isCompleted: boolean
}

export const getTasks = async function ({ isCompleted = false }: IGetTaskParams): Promise<Array<Task>> {
    const taskRepository: Repository<Task> = getRepository(Task);
    const tasks = await taskRepository.find({
        completed: isCompleted
    });
    return tasks;
};