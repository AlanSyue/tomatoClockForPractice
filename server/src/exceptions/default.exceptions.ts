import { ErrorRequestHandler } from 'express';

const defaultExceptionHandler: ErrorRequestHandler = function (err, req, res, next) {
    res.status(500).send({
        status: 500,
        message: 'Something broke!'
    });
}

export default defaultExceptionHandler;
