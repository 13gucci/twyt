export class ErrorWithStatusCode {
    message: string;
    status_code: number;

    constructor({ message, status_code }: { message: string; status_code: number }) {
        this.message = message;
        this.status_code = status_code;
    }
}
