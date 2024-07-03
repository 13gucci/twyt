import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RegisterReqBody } from '~/@types/requests/user.type.request';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { SUCCESS_MESSAGES } from '~/constants/messages';
import User from '~/models/schemas/user.schema';
import userServices from '~/services/user.services';
//
export const loginController = async (req: Request, res: Response) => {
    const { user } = req;
    const { _id } = user as User;

    if (_id) {
        const response = await userServices.login(_id.toString());
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            response
        });
    }
};

export const registerController = async (
    req: Request<ParamsDictionary, unknown, RegisterReqBody>,
    res: Response,
    next: NextFunction
) => {
    const { email, password, date_of_birth, name } = req.body;

    const response = await userServices.register({ date_of_birth, email, name, password });

    return res.status(HTTP_STATUS_CODES.CREATED).json({
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        response
    });
};
