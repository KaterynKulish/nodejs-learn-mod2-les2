import fs from 'node:fs/promises';
import { SONG_DB_PATH } from '../../constants/songs.js';

export const writeSongs = async (updateSongs) => {
  await fs.writeFile(SONG_DB_PATH, JSON.stringify(updateSongs, null, 2));
};
