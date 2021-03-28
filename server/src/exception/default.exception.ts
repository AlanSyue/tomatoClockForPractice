import { ErrorRequestHandler } from 'express';
import { HttpStatus } from '../common/response/response.type';

// err 是由 formatResponse 所建立的 ResponseObject
const defaultExceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || HttpStatus.INTERNAL_ERROR).json(err)
}

export default defaultExceptionHandler;