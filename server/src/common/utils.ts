import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "./response/response.type";
import { ResponseObject } from "./response/response.object";

export const formatResponse = (data: any, status = HttpStatus.INTERNAL_ERROR): ResponseObject<any> => {
    const options: any = { status };

    status >= 400
        ? options.message = data
        : options.data = data;

    const responseObject = new ResponseObject(options);

    return responseObject;
}

export const asyncHandler = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

export const responseHandler = (method: (req: Request, res: Response, next: NextFunction) => Promise<ResponseObject<any>>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        method(req, res, next)
            .then(obj => res.status(obj.status).json(obj))
            .catch((err: Error) => next(formatResponse(err.message, (err as any).status || HttpStatus.INTERNAL_ERROR)));
    }
};
