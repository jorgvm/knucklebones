import { PlayerName } from "@knucklebones/shared/types.js";
import { sanitizeName } from "@knucklebones/shared/utilities/sanitise.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { actionCreateGame } from "~/actions/create-game.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow Nuxt app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  try {
    console.log("Client connected:", socket.id);

    // socket.on("message", async (message: string) => {
    //   console.log(`Received: `, message);
    //   socket.emit("message", `Echo: ${message}`);

    //   try {
    //     const { action, data } = JSON.parse(message);
    //     console.log({ action, data });

    //     let result;

    //     switch (action) {
    //       case "createGame": {
    //         result = await actionCreateGame(data);
    //       }
    //     }

    //     console.log({ result });
    //     socket.emit("message", result);
    //   } catch (e) {
    //     console.error("Something went wrong in the server");
    //     console.dir(e, { depth: null });
    //   }
    // });

    socket.on("createGame", async (data: string) => {
      const { playerName }: { playerName: PlayerName } = JSON.parse(data);
      console.log("test", playerName);

      const result = await actionCreateGame({ playerName });

      console.log({ result });
      socket.emit("createGameResult", result);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  } catch (e) {
    console.error("Something went wrong in the server");
    console.dir(e, { depth: null });
  }
});

httpServer.listen(8080, () => {
  console.log("Socket.IO server running on http://localhost:8080");
});
