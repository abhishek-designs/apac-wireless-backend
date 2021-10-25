import "newrelic";
import express from "express";
import cors from "cors";
import "babel-polyfill";
import bodyParser from "body-parser";
import helmet from "helmet";
import api from "./api";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import ChatController from "./api/controllers/chatController";
import { randomUUID } from "crypto";
import fs from "fs";

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Initializing main server
// const io = new Server()
const { PORT = 8000 } = process.env;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use("/", api);

// Array consisting all of the chat messages b/w admin and customer
// const messages = [];

// httpServer.listen(PORT, () =>
//   console.log(`server started at http://localhost:${PORT}`)
// );
httpServer.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  ChatController.connect(socket);

  socket.on("chat-request", (user) => {
    const notification = {
      id: socket.id,
      user,
      msg: `${user.name} wants to chat with you`,
    };
    // console.log(user);
    ChatController.triggerGlobalEvents("to-admin", notification);
  });

  socket.on("request-alert", (alert) =>
    ChatController.triggerGlobalEvents("on-alert", alert)
  );

  socket.on("request-accept", (userid) => {
    const roomid = randomUUID();
    const response = {
      msg: "You r eligible for this chat",
      roomid,
    };

    ChatController.triggerPersonalEvents(userid, "on-request-accept", response);
  });

  socket.on("join-chat", (user, room) => {
    ChatController.joinRoom(room);
    ChatController.triggerGlobalEvents("on-join-chat", user, room);
  });

  socket.on("admin-join", (room) => {
    const message = {
      id: randomUUID(),
      userid: socket.id,
      msg: "Admin joined the chat",
    };
    ChatController.joinRoom(room);
    ChatController.triggerRoomEvents(room, "room-msg", message);
  });

  // SERVER Observing the sent messages
  socket.on("sent-message", (msg, room) => {
    // SERVER Forward the message to this room
    ChatController.triggerRoomEvents(room, "recieved-message", msg);
  });

  // SERVER Listen to this event user wants to leave the room
  socket.on("on-leave-room", (room, msg) => {
    // SERVER Kick out the users from the room
    ChatController.triggerRoomEvents(room, "room-msg", msg);
    ChatController.leaveRoom(room);
  });

  // ADMIN give indication to client for waiting
  socket.on("client-waiting", (waiting, id) => {
    console.log(waiting, id);
    // SERVER emit this indicator to specific client
    ChatController.triggerPersonalEvents(id, "on-waiting", waiting);
  });

  // SERVER Log when any user gets disconnected
  socket.on("disconnection", () =>
    console.log(`User ${socket.id} disconnected`)
  );
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

export default app;
