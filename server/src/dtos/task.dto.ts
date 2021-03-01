import { ResponseDTOBase } from './dto.base';
import { Task } from '../entity/Task';

export class ResponseTaskDTO extends ResponseDTOBase {

    public readonly id!: number;
    public readonly content!: string;
    public readonly completed!: boolean;
    public readonly completedAt!: string;

    constructor(entity: Task) {
        super(entity);
        this.id = entity.id;
        this.content = entity.content;
        this.completed = entity.completed;
        this.completedAt = entity.completedAt;
    }

}
