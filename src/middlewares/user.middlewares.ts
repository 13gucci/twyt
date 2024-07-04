import { checkSchema } from 'express-validator';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ERROR_MESSAGES } from '~/constants/messages';
import { ErrorWithStatusCode } from '~/models/errors';
import userServices from '~/services/user.services';
import hashPasswordOneWay from '~/utils/security';

export const loginValidator = checkSchema({
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
});

export const registerValidator = checkSchema({
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
});
