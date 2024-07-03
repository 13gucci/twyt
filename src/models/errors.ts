import HTTP_STATUS_CODES from '~/constants/httpStatusCode';
import { ERROR_MESSAGES } from '~/constants/messages';

export type ErrorsType = Record<
    string,
    {
        msg: string;
        [key: string]: any;
    }
>;

export class ErrorWithStatusCode {
    message: string;
    status_code: number;

    constructor({ message, status_code }: { message: string; status_code: number }) {
        this.message = message;
        this.status_code = status_code;
    }
}

export class EntityError extends ErrorWithStatusCode {
    errors: ErrorsType;

    constructor({ message = ERROR_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
        super({ message, status_code: HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY });
        this.errors = errors;
    }
}
