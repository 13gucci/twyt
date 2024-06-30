import { Request, Response } from 'express';
import User, { IUser } from '~/models/schemas/user.schema';
import databaseService from '~/services/database.services';
import userServices from '~/services/user.services';

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

export const registerController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const response = await userServices.register({ email, password });

        return res.json({
            message: 'register success',
            response
        });
    } catch (err) {
        return res.json({
            message: 'register failed'
        });
    }
};
