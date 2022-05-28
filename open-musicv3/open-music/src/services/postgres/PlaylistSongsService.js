const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    await this._cacheService.delete(`playlistsongs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1
      GROUP BY playlistsongs.song_id, songs.id`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }
}

module.exports = PlaylistsongsService;
