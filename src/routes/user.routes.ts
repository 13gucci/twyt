import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, registerController } from '~/controllers/user.controllers';
import { registerValidator } from '~/middlewares/user.middlewares';
import { requestValidator } from '~/utils/validation';
import { asyncHandler } from '~/utils/wrapperHandlers';

const router = Router();

router.post(ROUTES.USER.LOGIN, loginController);

// [POST] /api/register
router.post(ROUTES.USER.REGISTER, requestValidator(registerValidator), asyncHandler(registerController));

export default router;
