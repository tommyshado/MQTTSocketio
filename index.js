const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MQTT setup
const mqttClient = mqtt.connect("mqtt://localhost:1883");
const topic = "test/topic";

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message: ${message.toString()}`);
  io.emit("mqtt-message", message.toString());
});

app.use(express.static("public"));

// Set Up socket.io
io.on("connection", (socket) => {
  console.log("A user connected");
  // Join a room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
  // Handle message broadcasting to a room
  socket.on("send-to-room", (room, message) => {
    io.to(room).emit("mqtt-message", message);
    console.log(`Message sent to room ${room}: ${message}`);
  });
  // Leave a room
  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
