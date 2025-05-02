import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import librRouter from './routers/librs.js';
import authRouter from './routers/auth.js';

// import dotenv from 'dotenv';
// dotenv.config();
// аналогічний запис:
// import 'dotenv/config';

// отпимально: винесли dotenv в utils і імпортуємо:
import { getEnvVar } from './utils/getEnvVar.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UPLOAD_FILE_DIR } from './constants/index.js';

//=========== функція для старту серверу:
export const startServer = () => {
  const app = express(); //створює web-сервер

  //========== middlewares, потрібні для початку(які застосовуються для кожного запиту):
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json()); // прописує express json
  // app.use(logger);

  app.use('/upload', express.static(UPLOAD_FILE_DIR)); // для завантаження зображення/файла

  //========== маршрути
  // запит для перевірки, що сервер працює:

  app.use('/auth', authRouter);
  app.use('/librs', librRouter); //в об'єкті librRouter знаходяться обробники для запитів на шлях з librs

  //========== middlewares, потрібні після:
  // запит на адресу, якої немає:
  app.use(notFoundHandler);

  // для обробки помилок які передаємо в аргумент next:
  app.use(errorHandler);

  // запускає сервер на порті:
  //   const port = Number(process.env.PORT);
  // за допом.ф-ції getEnvVar:
  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server running on ${port} port`);
  });
};
