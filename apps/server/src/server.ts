import type {
  DataHandler,
  GameData,
  ResultCreateGameData,
  ResultJoinGameData,
  SendCreateGameData,
  SendJoinGameData,
  SendPlaceDieData,
  SubscribeToGameData,
} from "@knucklebones/shared/types.js";
import { isValidFirebaseDocumentId } from "@knucklebones/shared/utilities/sanitise.js";
import { onSnapshot } from "firebase/firestore";
import { createServer } from "http";
import { Server } from "socket.io";
import { actionCreateGame } from "~/actions/create-game.js";
import { actionJoinGame } from "~/actions/join-game.js";
import { actionPlaceDie } from "~/actions/place-die.js";
import { getDocRef, getGameFromDatabase } from "~/utilities/firebase.js";
import { toPublicGameData } from "~/utilities/to-public-gamedata.js";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  debug: false,
});

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  Sentry.captureMessage("Unhandled rejection", { extra: { reason } });
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  Sentry.captureException(error);
});

const httpServer = createServer((req, res) => {
  // Handle health ping
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });

    res.end("OK");
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ALLOWED_URL,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1000,
});

// Track listeners to avoid duplicates
const gameListeners = new Map<string, () => void>();

io.on("connection", (socket) => {
  // Create game
  socket.on(
    "createGame",
    async (data: string, callback: DataHandler<ResultCreateGameData>) => {
      const parsedData: SendCreateGameData = JSON.parse(data);
      const result = await actionCreateGame(parsedData);
      callback(result);
    }
  );

  // Join game
  socket.on(
    "joinGame",
    async (data: string, callback: DataHandler<ResultJoinGameData>) => {
      const parsedData: SendJoinGameData = JSON.parse(data);
      const result = await actionJoinGame(parsedData);
      callback(result);
    }
  );

  // Place die
  socket.on("placeDie", async (data: string) => {
    const parsedData: SendPlaceDieData = JSON.parse(data);
    await actionPlaceDie(parsedData);
  });

  // Subscribe to game
  socket.on("subscribeToGame", async (data: string) => {
    const { gameId }: SubscribeToGameData = JSON.parse(data);

    if (!isValidFirebaseDocumentId(gameId)) {
      console.error("Invalid firebase id was supplied");
      io.to(gameId).emit("error", "Game not found during subscription");
      return;
    }

    // Join a socket.io room for the game
    socket.join(gameId);

    // Upon subscription, always send game data
    const gameData = await getGameFromDatabase(gameId);

    const publicGameData = toPublicGameData(gameData);
    socket.emit("gameUpdate", publicGameData);

    // If gameListener does not exist, set it up
    if (!gameListeners.has(gameId)) {
      const docRef = getDocRef(gameId);
      const unsubscribe = onSnapshot(docRef, (onSnapshotDocSnap) => {
        // When Firebase is updated, send game data
        if (onSnapshotDocSnap.exists()) {
          const gameData = onSnapshotDocSnap.data() as GameData;
          const publicGameData = toPublicGameData(gameData);

          io.to(gameId).emit("gameUpdate", publicGameData);
        } else {
          console.error("Game not found during Firebase update");
          io.to(gameId).emit("error", "Game not found during subscription");
          return;
        }
      });

      gameListeners.set(gameId, unsubscribe);
    }
  });

  socket.on("disconnect", () => {
    // Check which rooms are now empty and clean up listeners
    gameListeners.forEach((unsubscribe, gameId) => {
      const room = io.sockets.adapter.rooms.get(gameId);
      const roomSize = room ? room.size : 0;

      if (roomSize === 0) {
        unsubscribe();
        gameListeners.delete(gameId);
      }
    });
    console.log(
      `User disconnected. Listeners remaining: ${gameListeners.size}`
    );
  });
});

// Use the PORT environment variable, fall back to 8080 for local development
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down");

  // Unsubscribe all Firestore listeners
  console.log(`Cleaning up ${gameListeners.size} Firestore listeners`);
  gameListeners.forEach((unsubscribe) => {
    unsubscribe();
  });
  gameListeners.clear();

  // Close socket.io
  io.close(() => {
    console.log("Socket.IO closed");
  });

  // Close server
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    console.error("forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
