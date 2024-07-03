import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

export const requestValidator = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await validation.run(req);
        const errors = validationResult(req);
        const errorsObject = errors.mapped();

        if (errors.isEmpty()) {
            return next();
        }

        console.log(errorsObject);
        return res.status(422).json({
            errors: errorsObject
        });
    };
};
