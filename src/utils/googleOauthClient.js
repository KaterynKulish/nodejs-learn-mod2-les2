import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const oAuth2Client = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI'), //це куди нас має повертати(адреса фронтенда)
}); //цей створений об'єкт класу OAuth2Client спілкується з Google

export const generateGoogleOAuthLink = () =>
  oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      // це дані, які маємо передати про юзера
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }); //функція для генерації посилання на авторизацію через Google OAuth

export const verifyToken = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    const idToken = tokens.id_token;
    //або так:
    // const { id_token: idToken } = tokens;

    if (!idToken) {
      throw createHttpError(401, 'Unauthorized');
    }

    const ticket = await oAuth2Client.verifyIdToken({ idToken });

    console.log(ticket); ////тут в LoginTicket.payload дані юзера з Google

    return ticket.getPayload();
  } catch (error) {
    console.log(error);
    throw createHttpError(401, 'Unauthorized');
  }
};
