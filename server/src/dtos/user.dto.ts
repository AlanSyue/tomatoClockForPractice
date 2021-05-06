import { ResponseDTOBase } from './dto.base';
import { User } from '../entity/User';

export class ResponseUserDTO extends ResponseDTOBase {

    public readonly id!: number;
    public readonly name!: string;
    public readonly email!: string;
    public readonly emailVerifiedStatus!: boolean;

    constructor(entity: User) {
        super(entity);
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;
        this.emailVerifiedStatus = entity.emailVerifiedStatus;
    }

}
