import type { GameData, SendPlaceDieData } from "@knucklebones/shared/types.js";
import { randomIntBetween } from "@knucklebones/shared/utilities/random-int-between.js";
import { waitFor } from "@knucklebones/shared/utilities/wait-for.js";
import type { Server, Socket } from "socket.io";
import { actionPlaceDie } from "~/actions/place-die.js";
import { nextBotMove } from "~/utilities/next-bot-move.js";
import { botId, botSecretId } from "~/utilities/server-id.js";

export function registerPlaceDieHandler(socket: Socket, io: Server): void {
  socket.on("placeDie", async (data: string) => {
    // Update game
    const parsedData: SendPlaceDieData = JSON.parse(data);
    const publicGameData = await actionPlaceDie(parsedData);

    // Notify all players
    io.to(publicGameData.id).emit("gameUpdate", publicGameData);

    // Handle bot turn
    if (
      publicGameData.status === "playing" &&
      publicGameData.type === "singleplayer" &&
      publicGameData.active_player === botId
    ) {
      // Update game
      const publicGameData2 = await makeBotMove(publicGameData);

      // Notify all players
      io.to(publicGameData.id).emit("gameUpdate", publicGameData2);
    }
  });
}

// Bot makes a move
const makeBotMove = async (publicGameData: GameData): Promise<GameData> => {
  let randomWaitTime = randomIntBetween(1000, 2500);

  if (publicGameData.latest_actions.includes("die_removed")) {
    // Wait longer, so remove actions dont follow each other too fast
    randomWaitTime += 2000;
  }

  await waitFor(randomWaitTime);

  const rackNumber = nextBotMove({
    gameData: publicGameData,
    newDieValue: publicGameData.new_die,
  });

  return await actionPlaceDie({
    gameId: publicGameData.id,
    playerId: botId,
    playerSecretId: botSecretId,
    rackNumber,
  });
};
