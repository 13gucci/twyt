import { Router } from 'express';
import { loginController } from '~/controllers/user.controllers';
import { loginValidator } from '~/middlewares/user.middlewares';

const router = Router();

router.post('/login', loginValidator, loginController);

export default router;
