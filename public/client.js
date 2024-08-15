const socket = io();
let currentRoom = "";

function joinRoom() {
  const room = document.getElementById("room-input").value;
  if (currentRoom && currentRoom !== room) {
    console.log("********", currentRoom);
    socket.emit("leave-room", currentRoom);
  }
  socket.emit("join-room", room);
  currentRoom = room;
  document.getElementById(
    "current-room"
  ).innerHTML = `Current room: ${currentRoom}`;
}

function sendMessage() {
  const message = document.getElementById("message-input").value;
  socket.emit("send-to-room", currentRoom, message);
}

socket.on("mqtt-message", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  document.getElementById("messages").appendChild(item);
});
