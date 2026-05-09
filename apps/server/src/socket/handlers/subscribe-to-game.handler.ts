import type { SubscribeToGameData } from "@knucklebones/shared/types.js";

import type { Server, Socket } from "socket.io";
import { toPublicGameData } from "~/utilities/to-public-gamedata.js";
import { isValidCryptoId } from "~/utilities/generate-id.js";
import { getGameFromDatabase } from "~/supabase/get-game.js";

export function registerSubscribeToGameHandler(
  socket: Socket,
  io: Server,
): void {
  socket.on("subscribeToGame", async (data: string) => {
    const { gameId }: SubscribeToGameData = JSON.parse(data);

    if (!isValidCryptoId(gameId)) {
      console.error("Invalid game id was supplied");
      io.to(gameId).emit("error", "Game not found during subscription");
      return;
    }

    // Join socket.io room for the game
    socket.join(gameId);

    // Upon subscription, always send latest game data
    const gameData = await getGameFromDatabase(gameId);
    socket.emit("gameUpdate", toPublicGameData(gameData));
  });
}
