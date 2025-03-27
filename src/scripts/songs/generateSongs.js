import { createFakeSong } from '../../utils/songs/createFakeSong.js';
import { readSongs } from '../../utils/songs/readSongs.js';
import { writeSongs } from '../../utils/songs/writeSongs.js';

const generateSongs = async (number) => {
  // const song = createFakeSong(); //зробили 1 пісню

  const songList = await readSongs(); // зчитуємо ті пісні, що є в файлі
  const newSongs = Array(number)
    .fill(0)
    .map(() => createFakeSong()); // створюємо нові пісні

  console.log([...songList, ...newSongs]);
  await writeSongs([...songList, ...newSongs]); //перезаписуємо файл db
};

generateSongs(2);
