import { getGameFromDatabase } from "~/server/utilities/firebase";
import {
  isValidFirebaseDocumentId,
  isValidCryptoId,
} from "~/utilities/sanitise";
import type { GameData } from "~/utilities/types";

export default defineEventHandler(async (event) => {
  const { gameId, playerId } = await readBody(event);

  // All ids should be valid
  const playerIdIsValid = !playerId || isValidCryptoId(playerId);
  if (!playerIdIsValid || !isValidFirebaseDocumentId(gameId)) {
    throw new Error("Game not found");
  }

  // Get game from database
  const result = (await getGameFromDatabase(gameId)) as GameData;

  if (!result) {
    throw new Error("Game not found");
  }

  // Remove other player id so moves can't be made for opponent
  result.players.forEach((player) => {
    if (playerId !== player.id) {
      return (player.id = "");
    }
  });

  return result;
});
