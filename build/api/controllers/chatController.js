"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatController = function () {
  function ChatController() {
    _classCallCheck(this, ChatController);

    socket = "";
  }

  _createClass(ChatController, null, [{
    key: "connect",
    value: function connect(socket) {
      this.socket = socket;
      this.socket && this.showLogs("Global", "New user connected " + socket.id);
    }
  }, {
    key: "showLogs",
    value: function showLogs(msgFor, msg) {
      console.log(msgFor + ": " + msg);
    }
  }, {
    key: "triggerGlobalEvents",
    value: function triggerGlobalEvents(event, param) {
      if (!!(arguments.length <= 2 ? 0 : arguments.length - 2)) {
        return this.socket.broadcast.emit(event, param, arguments.length <= 2 ? undefined : arguments[2]);
      }
      this.socket.broadcast.emit(event, param);
    }
  }, {
    key: "triggerLogEvents",
    value: function triggerLogEvents(event, param) {
      this.socket.emit(event, param);
    }
  }, {
    key: "triggerPersonalEvents",
    value: function triggerPersonalEvents(clientId, event, param) {
      this.socket.to(clientId).emit(event, param);
    }
  }, {
    key: "triggerRoomEvents",
    value: function triggerRoomEvents(roomId, event, param) {
      this.socket.to(roomId).emit(event, param);
    }
  }, {
    key: "joinRoom",
    value: function joinRoom(roomId) {
      this.socket.join(roomId);
    }
  }, {
    key: "leaveRoom",
    value: function leaveRoom(roomId) {
      this.socket.leave(roomId);
    }
  }]);

  return ChatController;
}();

module.exports = ChatController;