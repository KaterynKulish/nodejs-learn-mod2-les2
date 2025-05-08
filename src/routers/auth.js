import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  authLoginSchema,
  authRegisterSchema,
  googleOAuthValidationSchema,
} from '../validation/auth.js';
import {
  getGoogleOauthLinkController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  signUpOrLoginWithGoogleController,
  verifyController,
} from '../controllers/auth.js';

const authRouter = Router(); //ф-ція Router() створює об'єкт  де зберігатимуться маршрути .get

// маршрут для запиту реєстрації(singup) юзера:
authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

authRouter.get('/verify', ctrlWrapper(verifyController));

//маршрут для запиту на login
authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

// маршрут для refresh-токену
authRouter.post('/refresh', ctrlWrapper(refreshController));

//маршрут для logout
authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/get-google-oauth-link',
  ctrlWrapper(getGoogleOauthLinkController),
);

authRouter.post(
  '/login-with-google',
  validateBody(googleOAuthValidationSchema),
  ctrlWrapper(signUpOrLoginWithGoogleController),
);

export default authRouter;
