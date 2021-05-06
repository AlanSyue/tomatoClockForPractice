import { body } from 'express-validator';
import { validatorHandler } from '../../common/utils';

export const registerPipe = [
    body('name').notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape(),
    validatorHandler
]

export const signinPipe = [
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape(),
    validatorHandler
]

export const verifyPipe = [
    body('id').not().isEmpty(),
    body('verifiedCode').not().isEmpty().trim(),
    validatorHandler
]

