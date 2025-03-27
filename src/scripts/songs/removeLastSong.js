import { readSongs } from '../../utils/songs/readSongs.js';
import { writeSongs } from '../../utils/songs/writeSongs.js';

const removeLastSong = async () => {
  const songList = await readSongs();
  songList.pop(); //видаляє останній елемент масива
  await writeSongs(songList);
};

removeLastSong();
