import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, registerController } from '~/controllers/user.controllers';
import { loginValidator } from '~/middlewares/user.middlewares';

const router = Router();

// [POST]  /api/login
router.post(ROUTES.USER.LOGIN, loginValidator, loginController);

// [POST] /api/register
router.post(ROUTES.USER.REGISTER, registerController);

export default router;
