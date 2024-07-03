import { checkSchema } from 'express-validator';
import { resolve } from 'path';
import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ERROR_MESSAGES } from '~/constants/messages';
import { ErrorWithStatusCode } from '~/models/errors';
import userServices from '~/services/user.services';

export const registerValidator = checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name is required'
        },
        isString: {
            errorMessage: 'Name must be a string'
        },
        trim: true
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Email must be valid'
        },
        trim: true,
        custom: {
            options: async (value) => {
                const isExistedEmail = await userServices.checkExistEmail({ email: value });
                if (isExistedEmail) {
                    throw new ErrorWithStatusCode({
                        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
                        status_code: HTTP_STATUS_CODES.UNAUTHORIZED
                    });
                }
            }
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isString: {
            errorMessage: 'Password must be a string'
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 1
            },
            errorMessage:
                'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol'
        }
    },
    confirm_password: {
        notEmpty: {
            errorMessage: 'Confirm password is required'
        },
        custom: {
            options: (value, { req }) => value === req.body.password,
            errorMessage: 'Confirm password must match password'
        }
    },
    date_of_birth: {
        notEmpty: {
            errorMessage: 'Date of birth is required'
        },
        isISO8601: {
            options: {
                strict: true,
                strictSeparator: true
            },
            errorMessage: 'Date of birth must be a valid ISO8601 date'
        }
    }
});
