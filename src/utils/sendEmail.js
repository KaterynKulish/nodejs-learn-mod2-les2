import nodemailer from 'nodemailer';
import 'dotenv/config';

import { getEnvVar } from './getEnvVar.js';

const user = getEnvVar('UKR_NET_EMAIL');
const pass = getEnvVar('UKR_NET_PASSWORD');

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user, //пошта поштового серверу
    pass, //пароль від поштового серверу
  },
};

const transport = nodemailer.createTransport(nodemailerConfig); //це об'єкт,який відправляє лист

// const data = {
//   to: 'qweqwe@qwe.com',
//   subject: 'Hello',
//   text: 'Hello',
//   html: '<h1>Hello!</h1>',
// };

export const sendEmail = (data) => {
  const email = { ...data, from: user };
  return transport.sendMail(email);
};
