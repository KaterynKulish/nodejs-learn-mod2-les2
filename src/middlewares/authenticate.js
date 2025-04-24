import createHttpError from 'http-errors';

import { findSession, findUser } from '../servises/auth.js';

export const authenticate = async (req, res, next) => {
  //   const { authorization } = req.headers; //забираємо заголовок authorization - 1 варіант
  const authorization = req.get('Authorization'); //2 варіант
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authorization.split(' '); // перевірка чи є bearer в authorization в БД
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must have type Bearer'));
  }

  const session = await findSession({ accessToken }); // об'єкт з даними сесії
  if (!session) {
    return next(createHttpError(401, 'Session not found')); //перевірка чи є такий токен в сесії в БД
  }
  console.log(session);
  if (session.accessTokenValidUntil < Date.now()) {
    return next(createHttpError(401, 'Access token expired')); // перевірка часу життя access-токену
  }

  const user = await findUser({ _id: session.userId }); //об'єкт з даними юзера із БД з id із сесії - перевірка чи є в БД юзер з таким id як в сесії
  // console.log(user);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
