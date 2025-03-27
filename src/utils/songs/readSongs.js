import fs from 'node:fs/promises';
import { SONG_DB_PATH } from '../../constants/songs.js';

//стара версія на коллбеках:
// export const readSongs = async () => {
//   fs.readFile(SONG_DB_PATH, (error, data) => {
//     console.log(error);
//     console.log(data);
//   });
// };

// версія на промісах:
export const readSongs = async () => {
  // розкодування методом .toString()
  //   const buffer = await fs.readFile(SONG_DB_PATH);
  //   console.log(buffer);
  //   const text = buffer.toString();
  //   console.log(text);

  //розкодування вказанням формата кодування
  const data = await fs.readFile(SONG_DB_PATH, 'utf-8');
  console.log(data);
  return JSON.parse(data);
};
