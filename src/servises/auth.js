import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { TEMPLATES_DIR } from '../constants/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => SessionCollection.findOne(query);
//отримуємо об'єкт з даними активної сесії

export const findUser = (query) => UserCollection.findOne(query); //отримуємо з БД об'єкт з даними юзера

const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html'); //шлях до файлу шаблону листа підтвердження пошти при реєстрації юзера

const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

export const registerUser = async (payload) => {
  //перевірка унікальності email на рівні БД
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email }); //перевірка, що є унікальний в БД
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10); //хешування паролю

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: '24h',
  });

  const templateSource = await fs.readFile(verifyEmailPath, 'utf-8'); //читає шаблон листа в html-файлі як текст

  const template = Handlebars.compile(templateSource); // handlebars-шаблон листа - це ф-ція

  const html = template({
    verifyLink: `${appDomain}/auth/verify?token=${token}`,
  }); // викликаємо ф-цію

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html,
  };
  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    return UserCollection.findOneAndUpdate({ email }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email }); //перевірка чи є такий в БД

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  if (!user.verify) throw createHttpError(401, 'Email not verified'); //перевірка чи веріфікований юзер

  const passwordCompare = await bcrypt.compare(password, user.password); //перевірка чи співпадає пароль з БД

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id }); //видаляє сесію на іншому пристрої

  //   // створюємо рандомні токени:
  //   const accessToken = randomBytes(30).toString('base64');
  //   const refreshToken = randomBytes(30).toString('base64');

  //   return SessionCollection.create({
  //     userId: user._id,
  //     accessToken,
  //     refreshToken,
  //     accessTokenValidUntil: Date.now() + accessTokenLifeTime,
  //     refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  //   });
  //після виносу створення сесії в окрему ф-цію createSession:
  const session = createSession();
  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });
  // console.log(session);
  // console.log(refreshToken);
  // console.log(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  } //перевірка чи є сесія з такими refreshToken і sessionId

  if (session.refreshTokenValidUntil < Date.now()) {
    await SessionCollection.findOneAndDelete({ _id: session._id }); //видаляємо сесію бо час життя закінчився
    throw createHttpError(401, 'Session token expired');
  } //перевірка чи не закінчився час життя токену

  // //якщо сесія не закінчилась - відаляємо стару сесію і створюємо нову сесію з новими токенами:
  await SessionCollection.findOneAndDelete({ _id: session._id });
  // const accessToken = randomBytes(30).toString('base64');
  // const refreshToken = randomBytes(30).toString('base64');
  // return SessionCollection.create({
  //   userId: user._id,
  //   accessToken,
  //   refreshToken,
  //   accessTokenValidUntil: Date.now() + accessTokenLifeTime,
  //   refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  // });
  // //після виносу створення сесії в окрему ф-цію createSession:
  const newSession = createSession();
  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
