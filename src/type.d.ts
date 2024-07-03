import { Request } from 'express';
import User from './models/schemas/user.schema';

//Mở rộng kiểu dữ liệu của request
declare module 'express' {
    interface Request {
        user?: User;
    }
}
