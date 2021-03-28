import { Request, Response, NextFunction } from "express";
import { HttpStatus } from './response/response.type'
import { ResponseObject } from "./response/response.dto";

export const formatResponse = (data: any, status = HttpStatus.INTERNAL_ERROR): ResponseObject<any> => {
    const options: any = { status };
    status >= 400
        ? options.message = data
        : options.data = data;
    const responseObject = new ResponseObject(options);
    return responseObject;
}

// method 為在 controller 定義好的 restful API，responseHandler 將其作為參數執行
// 執行成功會收到 ResponseObject，並回傳
// 執行失敗會接續 error Handling function
export const responseHandler = (method: (req:Request, res:Response, next:NextFunction) => Promise<ResponseObject<any>> )=> {
    return (req: Request, res: Response, next: NextFunction) => {
        method(req, res, next)
            .then(obj => res.status(obj.status).json(obj))
            .catch((err: Error) => next(formatResponse(err.message, (err as any).status || HttpStatus.INTERNAL_ERROR)))
    }
}