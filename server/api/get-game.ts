import { getGameFromDatabase } from "~/server/utilities/firebase";
import type { GameData } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { gameId, playerId } = await readBody(event);

  if (!gameId) {
    throw new Error();
  }

  // Get game from database
  const result = (await getGameFromDatabase(gameId)) as GameData;

  if (!result) {
    throw new Error();
  }

  // Remove other player id so moves can't be made for opponent
  result.players.forEach((player) => {
    if (playerId !== player.id) {
      return (player.id = "");
    }
  });

  return result;
});
