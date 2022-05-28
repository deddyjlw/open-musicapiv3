class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._service.sendMessage('export:songs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
