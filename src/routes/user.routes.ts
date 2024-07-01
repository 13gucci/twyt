import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, registerController } from '~/controllers/user.controllers';
import { registerValidator } from '~/middlewares/user.middlewares';
import { requestValidator } from '~/utils/validation';

const router = Router();

router.post(ROUTES.USER.LOGIN, loginController);

router.post(ROUTES.USER.REGISTER, requestValidator(registerValidator), registerController);

export default router;
