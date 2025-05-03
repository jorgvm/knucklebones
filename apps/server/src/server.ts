import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow Nuxt app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  console.log(sanitizeName("test!"));

  socket.on("message", (message: string) => {
    console.log(`Received: ${message}`);
    socket.emit("message", `Echo: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(8080, () => {
  console.log("Socket.IO server running on http://localhost:8080");
});
