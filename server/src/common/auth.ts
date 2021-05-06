import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from './response/response.type';
import { JwtPayload } from '../dtos/auth.dto';
import jwt from 'jsonwebtoken'

export const getJwtSecret = () => process.env.JWT_SECRET || 'JWT_SECRET';
export const getTokenFromHeader = (req: Request) => String(req.headers['token']);

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req);
    const JWT_SECRET = getJwtSecret();
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        const customError = new Error('UNAUTHORIZED');
        (customError as any).status = HttpStatus.UNAUTHORIZED;
        throw customError;
    }
    res.locals.payload = new JwtPayload(payload);
    next()
}
