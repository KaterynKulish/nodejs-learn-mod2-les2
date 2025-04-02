import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';

// await initMongoConnection(); //ця ф-ція підключення до БД повинна бути до запуску сервера
// startServer();

const bootstrap = async () => {
  await initMongoConnection();
  startServer();
};

bootstrap();
