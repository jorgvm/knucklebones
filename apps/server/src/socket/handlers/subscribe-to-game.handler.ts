import type {
  GameData,
  SubscribeToGameData,
} from "@knucklebones/shared/types.js";
import { isValidFirebaseDocumentId } from "@knucklebones/shared/utilities/sanitise.js";
import { onSnapshot } from "firebase/firestore";
import type { Server, Socket } from "socket.io";
import { getDocRef, getGameFromDatabase } from "~/utilities/firebase.js";
import { toPublicGameData } from "~/utilities/to-public-gamedata.js";
import { addGameListener, hasGameListener } from "../game-listeners.js";

export function registerSubscribeToGameHandler(socket: Socket, io: Server) {
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
    if (!hasGameListener(gameId)) {
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

      addGameListener(gameId, unsubscribe);
    }
  });
}
