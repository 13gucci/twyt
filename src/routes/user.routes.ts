import { Router } from 'express';
import { ROUTES } from '~/constants/routes';
import {
    emailVerifyController,
    forgotPasswordController,
    loginController,
    logoutController,
    registerController,
    resendVerifyEmailController,
    verifyForgotPasswordController
} from '~/controllers/user.controllers';
import {
    accessTokenValidator,
    emailVerifyValidator,
    forgotPasswordValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    verifyForgotPasswordValidator
} from '~/middlewares/user.middlewares';
import { requestValidator } from '~/utils/validation';
import { asyncHandler } from '~/utils/wrapperHandlers';

const router = Router();

// [POST] /user/login
router.post(ROUTES.USER.LOGIN, requestValidator(loginValidator), asyncHandler(loginController));

// [POST] /user/register
router.post(ROUTES.USER.REGISTER, requestValidator(registerValidator), asyncHandler(registerController));

// [POST] /user/logout
router.post(
    ROUTES.USER.LOGOUT,
    [requestValidator(accessTokenValidator), requestValidator(refreshTokenValidator)],
    asyncHandler(logoutController)
);

// [POST] /user/verify-email
router.post(ROUTES.USER.VERIFY_EMAIL, requestValidator(emailVerifyValidator), asyncHandler(emailVerifyController));

// [POST] /user/resend-verify-email
router.post(
    ROUTES.USER.RESEND_VERIFY_EMAIL,
    requestValidator(accessTokenValidator),
    asyncHandler(resendVerifyEmailController)
);

// [POST] /user/forgot-password -- Send email to user
router.post(
    ROUTES.USER.FORGOT_PASSWORD,
    requestValidator(forgotPasswordValidator),
    asyncHandler(forgotPasswordController)
);

// [POST] /user/verify-forgot-password
router.post(
    ROUTES.USER.VERIFY_FORGOT_PASSWORD,
    requestValidator(verifyForgotPasswordValidator),
    asyncHandler(verifyForgotPasswordController)
);

// [POST] /user/api/reset-password

export default router;
