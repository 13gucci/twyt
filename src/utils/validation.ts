import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { EntityError, ErrorWithStatusCode } from '~/models/errors';

export const requestValidator = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await validation.run(req);
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }

        const errorsObject = errors.mapped();

        const entityErrors = new EntityError({ errors: {} });

        Object.keys(errorsObject).forEach((key) => {
            const { msg } = errorsObject[key];

            //Error is from ErrorWithStatusCode
            if (msg instanceof ErrorWithStatusCode && msg.status_code !== HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
                return next(msg);
            }

            entityErrors.errors[key] = errorsObject[key];
            return next(entityErrors);
        });
    };
};
