class ChatController {
  constructor() {
    socket = "";
  }

  static connect(socket) {
    this.socket = socket;
    this.socket && this.showLogs("Global", `New user connected ${socket.id}`);
  }

  static showLogs(msgFor, msg) {
    console.log(`${msgFor}: ${msg}`);
  }

  static triggerGlobalEvents(event, param, ...params) {
    if (!!params.length) {
      return this.socket.broadcast.emit(event, param, params[0]);
    }
    this.socket.broadcast.emit(event, param);
  }

  static triggerLogEvents(event, param) {
    this.socket.emit(event, param);
  }

  static triggerPersonalEvents(clientId, event, param) {
    this.socket.to(clientId).emit(event, param);
  }

  static triggerRoomEvents(roomId, event, param) {
    this.socket.to(roomId).emit(event, param);
  }

  static joinRoom(roomId) {
    this.socket.join(roomId);
  }

  static leaveRoom(roomId) {
    this.socket.leave(roomId);
  }
}

module.exports = ChatController;
