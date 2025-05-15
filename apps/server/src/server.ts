import type {
  GameId,
  PlayerName,
  SendCreateGameData,
  SendJoinGameData,
  SendPlaceDieData,
  SubscribeToGameData,
} from "@knucklebones/shared/types.js";
import { getDoc, onSnapshot } from "firebase/firestore";
import { createServer } from "http";
import { Server } from "socket.io";
import { actionCreateGame } from "~/actions/create-game.js";
import { actionJoinGame } from "~/actions/join-game.js";
import { actionPlaceDie } from "~/actions/place-die.js";
import { getDocRef } from "~/utilities/firebase.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ALLOWED_URL,
    methods: ["GET", "POST"],
  },
});

// Track listeners to avoid duplicates
const gameListeners = new Map<string, () => void>();

io.on("connection", (socket) => {
  try {
    // Create game
    socket.on("createGame", async (data: string) => {
      const { playerName }: SendCreateGameData = JSON.parse(data);

      const result = await actionCreateGame({ playerName });

      socket.emit("createGameResult", result);
    });

    // Join game
    socket.on("joinGame", async (data: string) => {
      const { playerName, gameId }: SendJoinGameData = JSON.parse(data);

      const result = await actionJoinGame({ playerName, gameId });

      socket.emit("joinGameResult", result);
    });

    // Place die
    socket.on("placeDie", async (data: string) => {
      const { gameId, playerId, rackNumber }: SendPlaceDieData =
        JSON.parse(data);

      await actionPlaceDie({ gameId, playerId, rackNumber });
    });

    // Subscribe to game
    socket.on("subscribeToGame", async (data: string) => {
      const { gameId }: SubscribeToGameData = JSON.parse(data);

      // Join a socket.io room for the game
      socket.join(gameId);

      // Upon subscription, always send game data
      const docRef = getDocRef(gameId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        socket.emit("gameUpdate", docSnap.data());
      } else {
        console.error("error, game not found");
        socket.emit("error", "Game not found");
      }

      // If it doesnt exist, set up Firebase listener
      if (!gameListeners.has(gameId)) {
        const unsubscribe = onSnapshot(docRef, (onSnapshotDocSnap) => {
          // When Firebase is updated, send game data
          if (onSnapshotDocSnap.exists()) {
            const gameData = onSnapshotDocSnap.data();
            io.to(gameId).emit("gameUpdate", gameData);
          } else {
            console.error("error, game not found during firebase update");
            io.to(gameId).emit("error", "Game not found during subscription");
          }
        });

        gameListeners.set(gameId, unsubscribe);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      // todo, loop through rooms and clean up listeners here if no one is left
    });
  } catch (e) {
    console.error("Something went wrong in the server");
    console.dir(e, { depth: null });
  }
});

// Use the PORT environment variable, fall back to 8080 for local development
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
