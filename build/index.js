"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("newrelic");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

require("babel-polyfill");

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _socket = require("socket.io");

var _uuid = require("uuid");

var _chatController = require("./api/controllers/chatController");

var _chatController2 = _interopRequireDefault(_chatController);

var _crypto = require("crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());

app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());
// Initializing main server
// const io = new Server()
var _process$env$PORT = process.env.PORT,
    PORT = _process$env$PORT === undefined ? 8000 : _process$env$PORT;


var httpServer = _http2.default.createServer(app);
var io = new _socket.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use("/", _api2.default);

// Array consisting all of the chat messages b/w admin and customer
// const messages = [];

// httpServer.listen(PORT, () =>
//   console.log(`server started at http://localhost:${PORT}`)
// );
httpServer.listen(PORT, function () {
  console.log("server started at http://localhost:" + PORT);
});

io.on("connection", function (socket) {
  _chatController2.default.connect(socket);

  socket.on("chat-request", function (user) {
    var notification = {
      id: socket.id,
      msg: user.name + " wants to chat with you"
    };
    console.log(user);
    // ChatController.triggerGlobalEvents("to-admin", notification);
  });

  socket.on("request-alert", function (alert) {
    return _chatController2.default.triggerGlobalEvents("on-alert", alert);
  });

  socket.on("request-accept", function (userid) {
    var roomid = (0, _crypto.randomUUID)();
    var response = {
      msg: "You r eligible for this chat",
      roomid: roomid
    };

    _chatController2.default.triggerPersonalEvents(userid, "on-request-accept", response);
  });

  socket.on("join-chat", function (user, room) {
    _chatController2.default.joinRoom(room);
    _chatController2.default.triggerGlobalEvents("on-join-chat", user, room);
  });

  socket.on("admin-join", function (room) {
    var message = {
      id: (0, _crypto.randomUUID)(),
      userid: socket.id,
      msg: "Admin joined the chat"
    };
    _chatController2.default.joinRoom(room);
    _chatController2.default.triggerRoomEvents(room, "room-msg", message);
  });

  // SERVER Observing the sent messages
  socket.on("sent-message", function (msg, room) {
    // SERVER Forward the message to this room
    _chatController2.default.triggerRoomEvents(room, "recieved-message", msg);
  });

  // SERVER Listen to this event user wants to leave the room
  socket.on("on-leave-room", function (room, msg) {
    // SERVER Kick out the users from the room
    _chatController2.default.triggerRoomEvents(room, "room-msg", msg);
    _chatController2.default.leaveRoom(room);
  });

  // ADMIN give indication to client for waiting
  socket.on("client-waiting", function (waiting, id) {
    // SERVER emit this indicator to specific client
    _chatController2.default.triggerPersonalEvents(id, "on-waiting", waiting);
  });

  // SERVER Log when any user gets disconnected
  socket.on("disconnection", function () {
    return console.log("User " + socket.id + " disconnected");
  });
});

// Ready to take ws request
// io.on("connection", (socket) => {
//   console.log("user connected");
//   // Send the recieved msg from client to admin
//   socket.on("user-msg", (res) => {
//     res.socketid = uuidV4();
//     io.emit("server-msg", res);
//   });
//   // Checking the typing state of the user and correspond according to that
//   socket.on("user-typing", (state) => {
//     // Show the typing state to another user except the one who's typing
//     socket.broadcast.emit("show-typing", state);
//   });
//   // Send the message to user when any user gets disconnected
//   socket.on("disconnect", (reason) => console.log(reason));
// });

exports.default = app;