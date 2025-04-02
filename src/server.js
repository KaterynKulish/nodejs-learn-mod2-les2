import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';

import { getLibrs, getLibrById } from './servises/librs.js';

// import dotenv from 'dotenv';
// dotenv.config();
// аналогічний запис:
// import 'dotenv/config';

// отпимально: винесли dotenv в utils і імпортуємо:
import { getEnvVar } from './utils/getEnvVar.js';

//=========== функція для старту серверу:
export const startServer = () => {
  const app = express(); //створює web-сервер

  //========== middlewares, потрібні для початку(які застосовуються для кожного запиту):
  app.use(cors());
  app.use(express.json());
  //   app.use(
  //     PinoHttp({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     }),
  //   );

  //========== маршрути
  // запит для перевірки, що сервер працює:

  app.get('/api/libr', async (req, res) => {
    const data = await getLibrs();
    res.json({
      status: 200,
      message: 'Successfully find libr',
      data,
    });
  });

  app.get('/api/librs/:id', async (req, res) => {
    console.log(req.params); //тут повертається те, що після : в адресі запиту(динамічний параметр)
    const { id } = req.params;

    const data = await getLibrById(id);

    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `Libr with id=${id} not found`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully find libr with id=${id}`,
      data,
    });
  });

  //========== middlewares, потрібні після:
  // запит на адресу, якої немає:
  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  // для обробки помилок:
  app.use((error, req, res, next) => {
    res.status(500).json({
      message: error.message,
    });
  });

  // запускає сервер:
  //   const port = Number(process.env.PORT);
  // за допом.ф-ції getEnvVar:
  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => {
    console.log(`Server running on ${port} port`);
  });
};
