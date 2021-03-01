import { ErrorRequestHandler } from 'express';
import { HttpStatus } from '../common/response/response.type';
const defaultExceptionHandler: ErrorRequestHandler = function (err, req, res, next) {
    res.status(err.status || HttpStatus.INTERNAL_ERROR).json(err)
}

export default defaultExceptionHandler;
