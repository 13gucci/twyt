import { Request, Response } from 'express';

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
