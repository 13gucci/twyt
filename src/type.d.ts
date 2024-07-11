import 'express';
import { TokenPayload } from './@types/requests/user.type.request';
import User from './models/schemas/user.schema';

//Mở rộng kiểu dữ liệu của request
declare module 'express' {
    interface Request {
        user?: User;
        decoded_access_token?: TokenPayload;
        decoded_refresh_token?: TokenPayload;
        decoded_email_verify_token?: TokenPayload;
        decoded_forgot_password_token?: TokenPayload;
    }
}
