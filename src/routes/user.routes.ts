import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import {
    emailVerifyController,
    loginController,
    logoutController,
    registerController,
    resendVerifyEmailController
} from '~/controllers/user.controllers';
import {
    accessTokenValidator,
    emailVerifyValidator,
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

// [POST] /api/logout
router.post(
    ROUTES.USER.LOGOUT,
    [requestValidator(accessTokenValidator), requestValidator(refreshTokenValidator)],
    asyncHandler(logoutController)
);

// [POST] /api/verify-email
router.post(ROUTES.USER.VERIFY_EMAIL, requestValidator(emailVerifyValidator), asyncHandler(emailVerifyController));

// [POST] /api/resend-verify-email
router.post(
    ROUTES.USER.RESEND_VERIFY_EMAIL,
    requestValidator(accessTokenValidator),
    asyncHandler(resendVerifyEmailController)
);

// [POST] /api/forgot-password
router.post(ROUTES.USER.FORGOT_PASSWORD);

export default router;
