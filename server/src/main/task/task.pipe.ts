import * as express from 'express';
import { body, validationResult } from 'express-validator';

export const testPipe = [
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape(),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]