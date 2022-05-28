const { Pool } = require('pg');

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistBy(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
        JOIN songs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1
        GROUP BY playlistsongs.song_id, songs.id`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsongsService;
