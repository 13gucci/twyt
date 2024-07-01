import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, registerController } from '~/controllers/user.controllers';
import { registerValidator } from '~/middlewares/user.middlewares';
import { requestValidator } from '~/utils/validation';

const router = Router();

router.post(ROUTES.USER.LOGIN, loginController);

router.post(
    ROUTES.USER.REGISTER,
    requestValidator(registerValidator),
    (req, res, next) => {
        console.log('Request handler 1');
        next(new Error('Loi roi ban  ei'));
    },
    (req, res, next) => {
        console.log('Request handler 2');
        next();
    },
    (req, res, next) => {
        console.log('Request handler 3');
        res.json({
            message: 'register success'
        });
    },
    (err, req, res, next) => {
        res.status(405).send({
            error: err.message
        });
    }
);

export default router;
