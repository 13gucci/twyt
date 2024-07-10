import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { LogoutReqBody, RegisterReqBody, TokenPayload, VerifyEmailReqBody } from '~/@types/requests/user.type.request';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '~/constants/messages';
import { ErrorWithStatusCode } from '~/models/errors';
import User, { EUserVerifyStatus } from '~/models/schemas/user.schema';
import userServices from '~/services/user.services';
//
export const loginController = async (req: Request, res: Response) => {
    const { user } = req;
    const { _id } = user as User;

    if (_id) {
        const response = await userServices.login({ user_id: _id.toString() });

        return res.status(HTTP_STATUS_CODES.OK).json({
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: {
                access_token: response.access_token,
                refresh_token: response.refresh_token
            }
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
        data: {
            access_token: response.access_token,
            refresh_token: response.refresh_token
        }
    });
};

export const logoutController = async (req: Request<ParamsDictionary, unknown, LogoutReqBody>, res: Response) => {
    const { refresh_token } = req.body;
    const response = await userServices.logout({ token: refresh_token });

    return res.status(HTTP_STATUS_CODES.OK).json({
        message: response.message
    });
};

export const emailVerifyController = async (
    req: Request<ParamsDictionary, unknown, VerifyEmailReqBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_email_verify_token as TokenPayload;
    const { email_verify_token } = req.body;

    const user = await userServices.checkExistUserById({ user_id });

    if (!user) {
        return next(
            new ErrorWithStatusCode({
                message: ERROR_MESSAGES.USER_NOT_FOUND,
                status_code: HTTP_STATUS_CODES.NOT_FOUND
            })
        );
    }

    //Đã verify rồi
    //Trường hợp user bấm lại link verify
    if (user.email_verify_token === '') {
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: SUCCESS_MESSAGES.EMAIL_VERIFIED
        });
    }

    const { access_token, refresh_token } = await userServices.verifyEmail({ user_id });

    return res.status(HTTP_STATUS_CODES.OK).json({
        message: SUCCESS_MESSAGES.EMAIL_VERIFY_SUCCESS,
        data: {
            access_token,
            refresh_token
        }
    });
};

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_access_token as TokenPayload;
    console.log(req.decoded_access_token);
    const response = await userServices.checkExistEmailVerifyTokenByUserId({ user_id });
    console.log(response);
    if (!response) {
        return next(
            new ErrorWithStatusCode({
                message: ERROR_MESSAGES.USER_NOT_FOUND,
                status_code: HTTP_STATUS_CODES.NOT_FOUND
            })
        );
    }

    if (response.verify === EUserVerifyStatus.Verified) {
        return res.status(HTTP_STATUS_CODES.OK).json({
            message: SUCCESS_MESSAGES.EMAIL_VERIFIED
        });
    }

    const result = await userServices.resendVerifyEmail({ user_id });

    return res.status(HTTP_STATUS_CODES.OK).json(result);
};
