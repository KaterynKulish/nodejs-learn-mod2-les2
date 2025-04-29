import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
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

export default authRouter;
