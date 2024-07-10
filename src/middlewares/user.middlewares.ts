import { Request } from 'express';
import { check, checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ERROR_MESSAGES } from '~/constants/messages';
import { ErrorWithStatusCode } from '~/models/errors';
import refreshTokenServices from '~/services/refresh_token.services';
import userServices from '~/services/user.services';
import { verifyToken } from '~/utils/jwt';
import hashPasswordOneWay from '~/utils/security';

export const loginValidator = checkSchema(
    {
        email: {
            isEmail: {
                errorMessage: ERROR_MESSAGES.EMAIL_MUST_VALID
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await userServices.checkLogin({
                        email: value,
                        password: hashPasswordOneWay(req.body.password)
                    });
                    if (user === null) {
                        throw new ErrorWithStatusCode({
                            message: ERROR_MESSAGES.INVALID_CREDENTIALS,
                            status_code: HTTP_STATUS_CODES.BAD_REQUEST
                        });
                    }
                    req.user = user;
                    return true;
                }
            }
        },
        password: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.PASSWORD_IS_REQUIRED
            }
        }
    },
    ['body']
);

export const registerValidator = checkSchema(
    {
        name: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.NAME_IS_REQUIRED
            },
            isString: {
                errorMessage: ERROR_MESSAGES.NAME_IS_STRING
            },
            trim: true
        },
        email: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.EMAIL_IS_REQUIRED
            },
            isEmail: {
                errorMessage: ERROR_MESSAGES.EMAIL_MUST_VALID
            },
            trim: true,
            custom: {
                options: async (value) => {
                    const isExistedEmail = await userServices.checkExistEmail({ email: value });
                    if (isExistedEmail) {
                        throw new ErrorWithStatusCode({
                            message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
                            status_code: HTTP_STATUS_CODES.CONFLICT
                        });
                    }
                }
            }
        },
        password: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isString: {
                errorMessage: ERROR_MESSAGES.PASSWORD_IS_STRING
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minNumbers: 1,
                    minUppercase: 1,
                    minSymbols: 1
                },
                errorMessage: ERROR_MESSAGES.PASSWORD_TOO_WEAK
            }
        },
        confirm_password: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED
            },
            custom: {
                options: (value, { req }) => value === req.body.password,
                errorMessage: ERROR_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH
            }
        },
        date_of_birth: {
            notEmpty: {
                errorMessage: ERROR_MESSAGES.DOB_REQUIRED
            },
            isISO8601: {
                options: {
                    strict: true,
                    strictSeparator: true
                },
                errorMessage: ERROR_MESSAGES.DOB_MUST_VALID
            }
        }
    },
    ['body']
);

export const accessTokenValidator = checkSchema(
    {
        authorization: {
            custom: {
                options: async (value: string, { req }) => {
                    if (!value) {
                        throw new ErrorWithStatusCode({
                            message: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED,
                            status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                        });
                    }

                    const [bearer, token] = value.split(' ');

                    //Kiểm tra định dạng
                    if (bearer !== 'Bearer') {
                        throw new ErrorWithStatusCode({
                            message: ERROR_MESSAGES.ACCESS_TOKEN_INVALID_FORMAT,
                            status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                        });
                    }

                    if (!process.env.JWT_ACCESS_KEY) {
                        throw new Error('Do not have token');
                    }

                    //Kiểm tra token
                    try {
                        const decoded_access_token = await verifyToken({
                            token: token,
                            secretKey: process.env.JWT_ACCESS_KEY
                        });
                        (req as Request).decoded_access_token = decoded_access_token;
                    } catch (err) {
                        if (err instanceof JsonWebTokenError) {
                            throw new ErrorWithStatusCode({
                                message: `access_token: ${err.message}`,
                                status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                            });
                        }
                        throw err;
                    }

                    return true;
                }
            }
        }
    },
    ['headers']
);

export const refreshTokenValidator = checkSchema(
    {
        refresh_token: {
            custom: {
                options: async (value: string, { req }) => {
                    if (!value) {
                        throw new ErrorWithStatusCode({
                            message: ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED,
                            status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                        });
                    }

                    if (!process.env.JWT_REFRESH_KEY) {
                        throw new Error('Do not have token');
                    }

                    try {
                        const [decoded_refresh_token, response] = await Promise.all([
                            verifyToken({
                                token: value,
                                secretKey: process.env.JWT_REFRESH_KEY
                            }),
                            refreshTokenServices.checkExistRefreshToken({ token: value })
                        ]);

                        if (response === null) {
                            throw new ErrorWithStatusCode({
                                message: ERROR_MESSAGES.REFRESH_TOKEN_NOT_EXIST,
                                status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                            });
                        }

                        (req as Request).decoded_refresh_token = decoded_refresh_token;
                    } catch (err) {
                        if (err instanceof JsonWebTokenError) {
                            throw new ErrorWithStatusCode({
                                message: `refresh_token: ${err.message}`,
                                status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                            });
                        }
                        throw err;
                    }
                }
            }
        }
    },
    ['body']
);

export const emailVerifyValidator = checkSchema({
    email_verify_token: {
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new ErrorWithStatusCode({
                        message: ERROR_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                        status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                    });
                }

                if (!process.env.JWT_EMAIL_VERIFY_KEY) {
                    throw new Error('Do not have token');
                }

                const decoded_email_verify_token = await verifyToken({
                    token: value,
                    secretKey: process.env.JWT_EMAIL_VERIFY_KEY
                });

                (req as Request).decoded_email_verify_token = decoded_email_verify_token;

                return true;
            }
        }
    }
});

export const forgotPasswordValidator = checkSchema({
    email: {
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new ErrorWithStatusCode({
                        message: ERROR_MESSAGES.EMAIL_IS_REQUIRED,
                        status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                    });
                }

                const response = await userServices.checkExistEmail({ email: value });

                if (!response) {
                    throw new ErrorWithStatusCode({
                        message: ERROR_MESSAGES.USER_NOT_FOUND,
                        status_code: HTTP_STATUS_CODES.NOT_FOUND
                    });
                }

                req.user = response;
                return true;
            }
        }
    }
});
