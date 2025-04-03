import express from 'express';
import cors from 'cors';
import librRouter from './routers/librs.js';

// import dotenv from 'dotenv';
// dotenv.config();
// аналогічний запис:
// import 'dotenv/config';

// отпимально: винесли dotenv в utils і імпортуємо:
import { getEnvVar } from './utils/getEnvVar.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

//=========== функція для старту серверу:
export const startServer = () => {
  const app = express(); //створює web-сервер

  //========== middlewares, потрібні для початку(які застосовуються для кожного запиту):
  app.use(cors());
  app.use(express.json());
  // app.use(logger);

  //========== маршрути
  // запит для перевірки, що сервер працює:

  app.use('/librs', librRouter); //в об'єкті librRouter знаходяться обробники для запитів на шлях з librs

  //========== middlewares, потрібні після:
  // запит на адресу, якої немає:
  app.use(notFoundHandler);

  // для обробки помилок які передаємо в аргумент next:
  app.use(errorHandler);

  // запускає сервер:
  //   const port = Number(process.env.PORT);
  // за допом.ф-ції getEnvVar:
  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server running on ${port} port`);
  });
};
