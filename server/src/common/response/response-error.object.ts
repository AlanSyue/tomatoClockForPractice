import { HttpStatus } from './response.type';

export class ResponseError extends Error {

    public status: HttpStatus;

    constructor(message: any = '', status = HttpStatus.INTERNAL_ERROR) {
        super(message);
        this.status = status;
    }
}