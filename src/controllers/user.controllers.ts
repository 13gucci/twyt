import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import STATUS_CODES from '~/constants/httpStatusCode';
import { RegisterReqBody } from '~/models/requests/user.request';
import userServices from '~/services/user.services';
//
export const loginController = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (email === 'bibabibum0110@gmail.com' && password === '123456') {
        return res.status(200).send({
            message: 'success'
        });
    }

    return res.status(400).json({
        message: 'Username or password failed'
    });
};

export const registerController = async (req: Request<ParamsDictionary, unknown, RegisterReqBody>, res: Response, next: NextFunction) => {
    const { email, password, date_of_birth, name } = req.body;

    const response = await userServices.register({ date_of_birth, email, name, password });

    return res.status(STATUS_CODES.CREATED).json({
        message: 'Register user successfully',
        response
    });
};
