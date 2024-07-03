import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ErrorWithStatusCode } from '~/models/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorWithStatusCode) {
        return res.status(err.status_code).json(omit(err, ['status_code']));
    }

    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, {
            enumerable: true
        });
    });

    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        errorInfor: omit(err, ['stack'])
    });
};
