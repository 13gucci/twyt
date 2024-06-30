import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, registerController } from '~/controllers/user.controllers';
import { loginValidator } from '~/middlewares/user.middlewares';

const router = Router();

router.post(ROUTES.USER.LOGIN, loginValidator, loginController);
router.post(ROUTES.USER.REGISTER, registerController);

export default router;
