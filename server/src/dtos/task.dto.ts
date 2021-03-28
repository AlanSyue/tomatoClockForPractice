import { Task } from '../entity/Task'

export class ResponseTaskDTO {

    public readonly id!: number; //!表示保證他存在，不為null
    public readonly content!: string;
    public readonly completed!: boolean;
    public readonly completedAt!: string;


    constructor(task: Task) {
        this.id = task.id;
        this.content = task.content;
        this.completed = task.completed;
        this.completedAt = task.completedAt;
    }
}