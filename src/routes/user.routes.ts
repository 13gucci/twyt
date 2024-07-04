import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import { loginController, logoutController, registerController } from '~/controllers/user.controllers';
import {
    accessTokenValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator
} from '~/middlewares/user.middlewares';
import { requestValidator } from '~/utils/validation';
import { asyncHandler } from '~/utils/wrapperHandlers';

const router = Router();

// [POST] /api/login
router.post(ROUTES.USER.LOGIN, requestValidator(loginValidator), asyncHandler(loginController));

// [POST] /api/register
router.post(ROUTES.USER.REGISTER, requestValidator(registerValidator), asyncHandler(registerController));

// [POST] /api/Logout
router.post(
    ROUTES.USER.LOGOUT,
    [requestValidator(accessTokenValidator), requestValidator(refreshTokenValidator)],
    asyncHandler(logoutController)
);

export default router;
